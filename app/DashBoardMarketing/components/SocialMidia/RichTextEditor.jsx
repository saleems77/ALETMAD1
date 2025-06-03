// src/components/RichTextEditor.jsx
"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Box, ButtonGroup, Button } from '@mui/material';
import { useEffect } from 'react';

// تهيئة المحرر مع دعم RTL يدويًا
const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: {
          HTMLAttributes: {
            dir: 'rtl'
          }
        }
      })
    ],
    content: value,
    editorProps: {
      attributes: {
        style: 'text-align: right; direction: rtl; font-family: Tajawal, Arial; min-height: 200px; padding: 16px; border: 1px solid #ddd; border-radius: 4px;'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // أدوات التنسيق المخصصة
  const CustomToolbar = () => (
    <ButtonGroup sx={{ mb: 2, gap: 1 }}>
      <Button
        variant="contained"
        size="small"
        onClick={() => editor.chain().focus().toggleBold().run()}
        color={editor?.isActive('bold') ? 'primary' : 'inherit'}
      >
        عريض
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        color={editor?.isActive('italic') ? 'primary' : 'inherit'}
      >
        مائل
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        color={editor?.isActive('bulletList') ? 'primary' : 'inherit'}
      >
        قائمة نقطية
      </Button>
    </ButtonGroup>
  );

  return (
    <Box sx={{ direction: 'rtl' }}>
      <CustomToolbar />
      <EditorContent editor={editor} />
    </Box>
  );
};

export default RichTextEditor;