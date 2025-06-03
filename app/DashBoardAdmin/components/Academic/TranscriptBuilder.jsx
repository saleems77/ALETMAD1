'use client';
import { useState } from 'react';
import TemplateSelector from './TemplateSelector';
import TranscriptEditor from './TranscriptEditor';

export default function TranscriptBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [content, setContent] = useState('');

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <TemplateSelector onSelect={setSelectedTemplate} />
      </div>
      <div className="lg:col-span-2">
        <TranscriptEditor 
          template={selectedTemplate}
          content={content}
          onChange={setContent}
        />
      </div>
    </div>
  );
}