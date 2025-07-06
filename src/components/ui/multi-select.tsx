import * as React from 'react';
import { ChevronDownIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Checkbox } from './checkbox';
import { Button } from './button';
import { Badge } from './badge';
import { FormLabel, FormMessage } from './form';

export interface MultiSelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  label,
  disabled,
  className,
  required
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const allSelected = value.length === options.length && options.length > 0;
  const indeterminate = value.length > 0 && value.length < options.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(options.map((o) => o.value));
    }
  };

  const handleOptionToggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const handleRemoveTag = (val: string) => {
    onChange(value.filter((v) => v !== val));
  };

  const handleClear = () => {
    onChange([]);
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <FormLabel className='mb-1 text-sm font-medium' htmlFor={label}>
          {label} {required && <span className='text-destructive'>*</span>}
        </FormLabel>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              'flex min-h-9 w-full flex-wrap items-center justify-between gap-2 px-3 py-1',
              disabled && 'pointer-events-none opacity-60'
            )}
            aria-label={label}
            type='button'
            disabled={disabled}
          >
            <div className='flex max-w-[80%] flex-wrap gap-1'>
              {value.length === 0 ? (
                <span className='text-muted-foreground'>{placeholder}</span>
              ) : (
                options
                  .filter((opt) => value.includes(opt.value))
                  .map((opt) => (
                    <Badge
                      key={opt.value}
                      className='bg-accent text-accent-foreground flex items-center gap-1 rounded px-2 py-0.5'
                    >
                      {opt.icon && <span>{opt.icon}</span>}
                      <span className='truncate'>{opt.label}</span>
                      <span
                        role='button'
                        tabIndex={-1}
                        className='hover:bg-muted ml-1 rounded p-0.5 cursor-pointer'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTag(opt.value);
                        }}
                        aria-label={`Remove ${opt.label}`}
                      >
                        <XIcon className='size-3.5' />
                      </span>
                    </Badge>
                  ))
              )}
            </div>
            <ChevronDownIcon className='size-4 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80 p-0' align='start'>
          <div className='max-h-60 overflow-y-auto p-2'>
            <div className='mb-2 flex items-center gap-2'>
              <Checkbox
                checked={
                  allSelected ? true : indeterminate ? 'indeterminate' : false
                }
                onCheckedChange={handleSelectAll}
                id='select-all'
              />
              <label htmlFor='select-all' className='cursor-pointer text-sm'>
                (Select All)
              </label>
            </div>
            {options.length === 0 && (
              <div className='text-muted-foreground px-2 py-4 text-sm'>
                No options
              </div>
            )}
            {options.map((opt) => (
              <div
                key={opt.value}
                className='hover:bg-accent flex cursor-pointer items-center gap-2 rounded px-2 py-1'
              >
                <Checkbox
                  checked={value.includes(opt.value)}
                  onCheckedChange={() => handleOptionToggle(opt.value)}
                  id={`option-${opt.value}`}
                />
                {opt.icon && <span>{opt.icon}</span>}
                <label
                  htmlFor={`option-${opt.value}`}
                  className='cursor-pointer text-sm'
                >
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
          <div className='flex justify-between gap-2 border-t p-2'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={handleClear}
              disabled={value.length === 0}
            >
              Clear
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
