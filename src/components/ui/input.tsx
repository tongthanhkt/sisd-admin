import * as React from 'react';

import { cn } from '@/lib/utils';
import { FormLabel, FormMessage } from './form';

type InputProps = React.ComponentProps<'input'> & {
  error?: boolean;
  helperText?: string;
  label?: string;
};
function Input({
  className,
  type,
  error,
  helperText,
  label,
  required,
  ...props
}: InputProps) {
  return (
    <div className='w-full space-y-1'>
      {label && (
        <FormLabel>
          {label}
          {required && <span className='text-destructive'>*</span>}
        </FormLabel>
      )}
      <input
        type={type}
        data-slot='input'
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className,
          {
            'border-destructive': error
          }
        )}
        {...props}
      />
      {helperText && (
        <FormMessage className='text-destructive'>{helperText}</FormMessage>
      )}
    </div>
  );
}

export { Input };
