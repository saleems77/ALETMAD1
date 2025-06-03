"use client"
import { useState } from 'react';
import TemplateCard from './TemplateCard';
import TemplateFilters from './TemplateFilters';
import { useTemplates } from './useTemplates';

export default function TemplateGallery() {
  const { templates } = useTemplates();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  // فلترة القوالب مع التحقق من القيم
  const filteredTemplates = templates.filter(template => {
    // التحقق من وجود الحقول الأساسية
    const safeTitle = template.title?.toLowerCase() || '';
    const safeContent = template.content?.toLowerCase() || '';
    const safeCategory = template.category || 'غير مصنف';
    
    const searchLower = searchQuery.toLowerCase();
    
    // تطابق البحث
    const matchesSearch = 
      safeTitle.includes(searchLower) ||
      safeContent.includes(searchLower);
    
    // تطابق الفئة
    const matchesCategory = 
      selectedCategory === 'الكل' ||
      safeCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4">
      <TemplateFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <TemplateCard 
            key={template.id}
            title={template.title || 'بدون عنوان'}
            content={template.content || 'لا يوجد محتوى'}
            category={template.category || 'غير مصنف'}
          />
        ))}
      </div>
    </div>
  );
}