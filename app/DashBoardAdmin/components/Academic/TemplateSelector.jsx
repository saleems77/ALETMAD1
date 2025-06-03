'use client';
import { templates } from './transcriptTemplates';

export default function TemplateSelector({ onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-xl shadow">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className="p-4 border rounded-lg hover:border-blue-500 transition-all"
        >
          <img 
            src={template.thumbnail} 
            alt={template.name}
            className="w-full h-32 object-cover mb-2 rounded"
          />
          <h3 className="font-medium">{template.name}</h3>
        </button>
      ))}
    </div>
  );
}