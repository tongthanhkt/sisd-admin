import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

type AppSelectProps = {
  label: string;
  onChange: (value: string) => void;
  value: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
  clearable?: boolean;
};
export const AppSelect = ({
  onChange,
  value,
  label,
  options,
  placeholder,
  required,
  clearable = false
}: AppSelectProps) => {
  return (
    <FormItem>
      <FormLabel>
        {label}
        {required && <span className='text-destructive'>*</span>}
      </FormLabel>
      <div className='group relative'>
        <Select onValueChange={onChange} value={value}>
          <FormControl>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((document) => (
              <SelectItem key={document.value} value={document.value}>
                {document.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {clearable && value && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='absolute top-1/2 right-2 z-10 h-4 w-4 -translate-y-1/2 rounded-full bg-white p-0 text-gray-500 group-hover:flex hover:bg-gray-50'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange('');
            }}
          >
            <X className='h-3 w-3' />
          </Button>
        )}
      </div>
      <FormMessage />
    </FormItem>
  );
};
