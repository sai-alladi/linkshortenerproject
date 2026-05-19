'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Edit2, Trash2 } from 'lucide-react';
import type { SelectShortLink } from '@/db/schema';

interface LinksListProps {
  links: SelectShortLink[];
  onEdit?: (link: SelectShortLink) => void;
  onDelete?: (link: SelectShortLink) => void;
}

export function LinksList({ links, onEdit, onDelete }: LinksListProps) {
  if (links.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No links yet. Create your first short link!</p>
      </Card>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <Card key={link.id} className="p-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{link.shortCode}</Badge>
              <span className="text-sm text-gray-500">
                {new Date(link.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm break-all text-blue-600 hover:underline cursor-pointer">
              {link.originalUrl}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  `${typeof window !== 'undefined' ? window.location.origin : ''}/${link.shortCode}`
                )
              }
              title="Copy short link"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(link)}
              title="Edit link"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(link)}
              title="Delete link"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
