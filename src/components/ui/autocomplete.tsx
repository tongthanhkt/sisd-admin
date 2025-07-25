'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { FormLabel } from '@/components/ui/form';

type Option = {
  value: string;
  label: string;
};

interface AutocompleteProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  onCreate?: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export function Autocomplete({
  options,
  value,
  onChange,
  onCreate,
  placeholder,
  label,
  required
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const handleSelect = (currentValue: string) => {
    const selectedOption = options.find(
      (option) => option.value === currentValue
    );
    if (selectedOption) {
      onChange(selectedOption.value);
    }
    setOpen(false);
  };

  const handleCreate = () => {
    if (onCreate && inputValue) {
      onCreate(inputValue);
      setInputValue('');
      setOpen(false);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const hasResults = filteredOptions.length > 0;
  const canCreate =
    onCreate &&
    inputValue &&
    !options.some(
      (option) => option.label.toLowerCase() === inputValue.toLowerCase()
    );

  return (
    <div className='w-full space-y-2'>
      <FormLabel>
        {label}
        {required && <span className='text-destructive'>*</span>}
      </FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={`w-full justify-between ${
              !value && 'text-muted-foreground hover:text-muted-foreground'
            }`}
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder || 'Select...'}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder || 'Search...'}
              onValueChange={setInputValue}
            />
            <CommandList>
              {!hasResults && !canCreate && (
                <CommandEmpty className='py-2 text-center'>
                  No results found.
                </CommandEmpty>
              )}
              {hasResults && (
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleSelect}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {canCreate && (
                <CommandGroup>
                  <CommandItem
                    onSelect={handleCreate}
                    className='cursor-pointer'
                  >
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Create &quot;{inputValue}&quot;
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
