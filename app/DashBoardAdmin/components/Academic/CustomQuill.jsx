'use client';
import dynamic from 'next/dynamic';
import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const TiptapEditor = dynamic(() => 
  import('@tiptap/react').then((mod) => mod.EditorContent), 
  { ssr: false }
);

const CustomTiptap = forwardRef(({ value, onChange, ...props }, ref) => {
  const editorRef = useRef(null);
  const internalRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useImperativeHandle(ref, () => ({
    getEditor: () => editor,
    getRoot: () => internalRef.current,
  }));

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value]);

  if (!editor) return (
    <div className="min-h-[300px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">جاري تحميل المحرر...</p>
      </div>
    </div>
  );

  return (
    <div ref={internalRef} className="border rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded ${
            editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
          }`}
        >
          عنوان 1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
        >
          غامق
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
        >
          مائل
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
        >
          قائمة نقطية
        </button>
      </div>
      
      <TiptapEditor 
        editor={editor} 
        className="[&_.ProseMirror]:rtl [&_.ProseMirror]:text-right"
      />
    </div>
  );
});

export default CustomTiptap;