'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateLinkAction } from './actions';
import type { SelectShortLink } from '@/db/schema';

interface EditLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: SelectShortLink | null;
  onSuccess?: () => void;
}

export function EditLinkModal({ open, onOpenChange, link, onSuccess }: EditLinkModalProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (link) {
      setUrl(link.originalUrl);
    }
  }, [link, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!link) {
      setError('No link selected');
      setIsLoading(false);
      return;
    }

    try {
      const result = await updateLinkAction({
        id: link.id,
        originalUrl: url,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
        </DialogHeader>

        {link && (
          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium text-gray-700">Short Code</label>
            <div className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-600">
              {link.shortCode}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL to Shorten
            </label>
            <Input
              type="url"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
