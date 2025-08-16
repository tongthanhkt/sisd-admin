import { Editor, IAllProps } from '@tinymce/tinymce-react';
import { FormLabel, FormMessage } from '../ui/form';
import { useState } from 'react';

export type TEditorOptions = {
  type: string;
  text: string; // text in toolbar
  configButton?: TEditorConfigTypeOption & { icon?: string };
  configMenu?: TEditorConfigTypeOption[];
};
export type TEditorConfigTypeOption = {
  text: string;
  content: string;
};

type AppEditorProps = IAllProps & {
  customToolbarOptions?: TEditorOptions[];
  onChange?: (content: string) => void;
  onFocusOut?: (content: string) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
};
export const AppEditor = ({
  label,
  required,
  error,
  helperText,
  onChange,
  ...props
}: AppEditorProps) => {
  return (
    <div className='space-y-2'>
      {label && (
        <FormLabel>
          {label} {required && <span className='text-destructive'>*</span>}
        </FormLabel>
      )}
      <Editor
        key={1}
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
        init={{
          height: 200,
          menubar: false,
          plugins:
            'anchor autolink charmap codesample emoticons link lists searchreplace table visualblocks wordcount',
          toolbar:
            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
        }}
        onEditorChange={onChange}
        {...props}
      />
      {error && (
        <FormMessage className='text-destructive'>{helperText}</FormMessage>
      )}
    </div>
  );
};
