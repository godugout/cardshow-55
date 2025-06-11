
import React from 'react';
import { SimpleEditor } from '@/components/editor/SimpleEditor';

const Editor = () => {
  return (
    <SimpleEditor
      initialData={null}
      onStartOver={() => {
        // Could add logic to reset the editor state
        window.location.reload();
      }}
    />
  );
};

export default Editor;
