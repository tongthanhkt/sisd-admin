'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ICatalog, ICatalogProduct } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

interface FloorProductTableProps {
  data: ICatalog[];
  columns: ColumnDef<ICatalogProduct>[];
  perPage: number;
}

export function FloorProductTable({
  data,
  columns,
  perPage
}: FloorProductTableProps) {
  const [selectedCatalog, setSelectedCatalog] = useState<string>(data[0].id);

  const filteredData = useMemo(() => {
    return (
      data.find((catalog) => catalog.id === selectedCatalog)?.products || []
    );
  }, [data, selectedCatalog]);

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil(filteredData.length / perPage)
  });

  const onCatalogChange = (id: string) => {
    setSelectedCatalog(id);
  };

  const catalogOptions = useMemo(() => {
    return data.map((catalog) => ({
      id: catalog.id,
      name: catalog.code
    }));
  }, [data]);

  return (
    <DataTable table={table}>
      <div className='flex items-end justify-between'>
        <div className='space-y-1'>
          <Label>Filter Catalog</Label>
          <Select onValueChange={onCatalogChange} value={selectedCatalog}>
            <SelectTrigger className='w-xs'>
              <SelectValue placeholder='Select categories' />
            </SelectTrigger>
            <SelectContent>
              {catalogOptions.map((catalog) => (
                <SelectItem key={catalog.id} value={catalog.id}>
                  {catalog.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DataTableToolbar table={table} />
      </div>
    </DataTable>
  );
}
