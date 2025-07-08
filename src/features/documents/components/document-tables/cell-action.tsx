'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useDeleteDocumentMutation } from '@/lib/api/documents';
import { Document } from '@/types';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface CellActionProps {
  data: Document;
}

export function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDocument] = useDeleteDocumentMutation();

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteDocument(data._id);
      toast.success('Document deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Mở menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/documents/${data._id}/edit`)}
          >
            <IconEdit className='mr-2 h-4 w-4' />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
