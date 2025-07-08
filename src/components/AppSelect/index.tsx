import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';

type AppSelectProps = {
  label: string;
  onChange: (value: string) => void;
  value: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
};
export const AppSelect = ({
  onChange,
  value,
  label,
  options,
  placeholder,
  required
}: AppSelectProps) => {
  return (
    <FormItem>
      <FormLabel>
        {label}
        {required && <span className='text-destructive'>*</span>}
      </FormLabel>
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
        <FormMessage />
      </Select>
    </FormItem>
  );
};
