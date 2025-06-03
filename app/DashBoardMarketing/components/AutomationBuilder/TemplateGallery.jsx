"use client"
import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiCheck, FiSearch } from 'react-icons/fi';

const mockTemplates = [
  {
    id: 1,
    name: "قائمة منتجات",
    type: "ecommerce",
    preview: "https://via.placeholder.com/300x200",
    tags: ["مبيعات", "تخفيضات"]
  },
  {
    id: 2,
    name: "ترحيب العملاء",
    type: "onboarding",
    preview: "https://via.placeholder.com/300x200",
    tags: ["جديد", "تسويق"]
  },
];

export default function TemplateGallery({ onTemplateSelect = () => {} }) { // ← إضافة قيمة افتراضية
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const filteredTemplates = mockTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (template) => {
    setSelectedTemplate(template.id);
    onTemplateSelect?.(template); // ← استخدام optional chaining [[7]]
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="mb-6 relative">
        <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="ابحث عن قالب..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div 
            key={template.id}
            className={`border rounded-lg overflow-hidden transition-all 
              ${selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="relative">
              <img 
                src={template.preview} 
                alt={template.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleSelect(template)}
                  className={`btn btn-sm ${
                    selectedTemplate === template.id 
                      ? 'btn-primary' 
                      : 'btn-ghost bg-white/90'
                  }`}
                >
                  {selectedTemplate === template.id ? (
                    <FiCheck className="mr-2" />
                  ) : null}
                  {selectedTemplate === template.id ? 'محدد' : 'اختيار'}
                </button>
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-semibold mb-2">{template.name}</h4>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="badge badge-outline badge-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// إضافة PropTypes للتحقق من صحة الـ props [[5]]
TemplateGallery.propTypes = {
  onTemplateSelect: PropTypes.func
};