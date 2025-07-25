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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useDeleteStoneCatalogMutation } from '@/lib/api/catalog';
import { ICatalog } from '@/types';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CatalogModal } from '../CatalogModal';

interface CellActionProps {
  data: ICatalog;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteStoneCatalog, { isLoading: isDeleting }] =
    useDeleteStoneCatalogMutation();

  const hasProducts = data.products.length > 0;

  const onConfirm = async () => {
    try {
      await deleteStoneCatalog(data.id).unwrap();
      toast.success('Catalog deleted.');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to delete catalog.');
    }
  };

  const handleDeleteClick = () => {
    if (hasProducts) {
      toast.error(
        `Cannot delete catalog with ${data.products.length} products. Please remove all products first.`
      );
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isDeleting}
      />
      <CatalogModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        catalog={data}
      />
      <TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              <IconEdit className='mr-2 h-4 w-4' />
              Chỉnh sửa
            </DropdownMenuItem>
            {hasProducts ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='w-full'>
                    <DropdownMenuItem
                      onClick={handleDeleteClick}
                      disabled={hasProducts}
                      className='cursor-not-allowed opacity-50'
                    >
                      <IconTrash className='mr-2 h-4 w-4' />
                      Xóa
                    </DropdownMenuItem>
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right' sideOffset={10}>
                  <p className='max-w-60 text-sm'>
                    Không thể xóa catalog có {data.products.length} sản phẩm.
                    <br />
                    Vui lòng xóa tất cả sản phẩm trước.
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <DropdownMenuItem onClick={handleDeleteClick}>
                <IconTrash className='mr-2 h-4 w-4' />
                Xóa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    </>
  );
};
