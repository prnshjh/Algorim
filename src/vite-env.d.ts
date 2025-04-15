/// <reference types="vite/client" />
// src/vite-env.d.ts
declare module '@monaco-editor/react' {
    import { EditorProps } from '@monaco-editor/react';
    const Editor: React.ComponentType<EditorProps>;
    export default Editor;
  }
