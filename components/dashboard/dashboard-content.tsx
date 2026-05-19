'use client';

import { useState } from 'react';
import { Link } from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LinksList } from './links-list';
import { CreateLinkModal } from './create-link-modal';
import { EditLinkModal } from './edit-link-modal';
import { DeleteLinkDialog } from './delete-link-dialog';
import type { SelectShortLink } from '@/db/schema';

interface DashboardContentProps {
  links: SelectShortLink[];
}

export function DashboardContent({ links: initialLinks }: DashboardContentProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [links, setLinks] = useState(initialLinks);
  const [selectedLink, setSelectedLink] = useState<SelectShortLink | null>(null);

  const handleCreateSuccess = async () => {
    // Refresh the page to get updated links
    window.location.reload();
  };

  const handleEditOpen = (link: SelectShortLink) => {
    setSelectedLink(link);
    setEditOpen(true);
  };

  const handleEditSuccess = () => {
    // Refresh the page to get updated links
    window.location.reload();
  };

  const handleDeleteOpen = (link: SelectShortLink) => {
    setSelectedLink(link);
    setDeleteOpen(true);
  };

  const handleDeleteSuccess = () => {
    // Refresh the page to get updated links
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Link className="text-white flex-shrink-0" size={36} />
                <div className="flex flex-col justify-center">
                  <h1 className="text-4xl font-bold text-white leading-tight">Dashboard</h1>
                  <p className="text-green-50 text-sm">Manage your shortened links</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setCreateOpen(true)}
                className="bg-white text-green-600 hover:bg-green-50 font-semibold shadow-md transition-all duration-200 hover:shadow-lg"
              >
                + Create Link
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-white text-green-600 hover:bg-green-50 font-semibold shadow-md transition-all duration-200 hover:shadow-lg">
                    ⚙️ Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <SignOutButton redirectUrl="/">
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600">
                      Sign Out
                    </DropdownMenuItem>
                  </SignOutButton>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <Card className="p-6 shadow-md border-0 hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Links</h2>
          <LinksList 
            links={links}
            onEdit={handleEditOpen}
            onDelete={handleDeleteOpen}
          />
        </Card>
      </div>

      <CreateLinkModal open={createOpen} onOpenChange={setCreateOpen} onSuccess={handleCreateSuccess} />
      <EditLinkModal 
        open={editOpen} 
        onOpenChange={setEditOpen} 
        link={selectedLink}
        onSuccess={handleEditSuccess}
      />
      <DeleteLinkDialog 
        open={deleteOpen} 
        onOpenChange={setDeleteOpen} 
        linkId={selectedLink?.id || 0}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
