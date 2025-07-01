'use client';

import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { FormLabel, FormMessage } from './form';

export function DatePicker({
  label,
  required,
  error,
  helperText,
  date,
  setDate
}: {
  label: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  date: Date;
  setDate: (date: Date) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className='flex flex-col gap-2'>
      <FormLabel htmlFor='date' className='px-1'>
        {label}
        {required && <span className='text-destructive'>*</span>}
      </FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            id='date'
            className='w-48 justify-between font-normal'
          >
            {date ? date.toLocaleDateString() : 'Select date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='single'
            selected={date}
            captionLayout='dropdown'
            onSelect={(date) => {
              setDate(date as Date);
              setOpen(false);
            }}
            className='w-full'
          />
        </PopoverContent>
      </Popover>
      {error && <FormMessage>{helperText}</FormMessage>}
    </div>
  );
}
