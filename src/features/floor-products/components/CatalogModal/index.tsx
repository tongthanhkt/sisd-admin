'use client';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateStoneCatalogMutation } from '@/lib/api/catalog';
import { ICatalog } from '@/types';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: ICatalog | null;
}

export const CatalogModal = ({
  isOpen,
  onClose,
  catalog
}: CatalogModalProps) => {
  const [code, setCode] = useState('');
  const [updateStoneCatalog, { isLoading }] = useUpdateStoneCatalogMutation();

  useEffect(() => {
    if (catalog) {
      setCode(catalog.code);
    }
  }, [catalog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!catalog || !code.trim()) {
      toast.error('Please enter a valid code');
      return;
    }

    try {
      await updateStoneCatalog({
        id: catalog.id,
        catalog: { code: code.trim() }
      }).unwrap();

      toast.success('Catalog updated successfully');
      onClose();
      setCode('');
    } catch (error) {
      toast.error('Failed to update catalog');
    }
  };

  const handleClose = () => {
    onClose();
    setCode('');
  };

  return (
    <Modal title='' description='' isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='code'>Catalog Code</Label>
          <Input
            id='code'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='Enter catalog code'
            required
          />
        </div>

        <div className='flex justify-end space-x-2'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
