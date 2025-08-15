import React from 'react';
import { Editor, IAllProps } from '@tinymce/tinymce-react';

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
};
export const AppEditor = ({ ...props }: AppEditorProps) => {
  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
      init={{
        plugins:
          'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
      }}
      {...props}
    />
  );
};
