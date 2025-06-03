'use client';
import dynamic from 'next/dynamic';
import { useRef, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';

const TiptapEditor = dynamic(() => 
  import('@tiptap/react').then((mod) => {
    const Component = mod.EditorContent;
    return React.forwardRef((props, ref) => <Component {...props} ref={ref} />);
  }), {
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">جاري تحميل المحرر...</p>
        </div>
      </div>
    )
  }
);

export default function TranscriptEditor({ template = 'default', content, onChange }) {
  const editorRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2],
      }),
      BulletList,
      ListItem,
    ],
    content: content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none p-4 h-[500px] overflow-y-auto text-right',
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
    setIsMounted(true);
  }, [editor]);

  if (!isMounted) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex flex-wrap gap-2 mb-4 border-b pb-4">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded ${
            editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
          }`}
        >
          عنوان رئيسي 1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${
            editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
          }`}
        >
          عنوان رئيسي 2
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
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded ${editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
        >
          تسطير
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
}