'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

const CourseEditor = ({ 
  courseToEdit, 
  onSave, 
  onClose, 
  categories 
}) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    discount: 0,
    level: 'مبتدئ',
    duration: '',
    category: '',
    image: '/default-course.jpg',
    rating: 4.5,
    certificate: false,
    prerequisites: []
  });

  useEffect(() => {
    if (courseToEdit) {
      setFormData(courseToEdit);
    }
  }, [courseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      discount: Number(formData.discount)
    });
    onClose();
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {courseToEdit ? 'تعديل الدورة' : 'إنشاء دورة جديدة'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* حقل اسم الدورة */}
          <div className="space-y-2">
            <label className="block font-medium">اسم الدورة</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* حقل التصنيف */}
          <div className="space-y-2">
            <label className="block font-medium">التصنيف</label>
            <select
              required
              className="w-full p-2 border rounded-lg"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="">اختر التصنيف</option>
              {categories.map(cat => (
                <option key={cat.categoryName} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* الحقول العددية */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-medium">السعر ($)</label>
              <input
                type="number"
                min="0"
                className="w-full p-2 border rounded-lg"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block font-medium">الخصم (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full p-2 border rounded-lg"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: e.target.value})}
              />
            </div>
          </div>

          {/* باقي الحقول... */}

          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <CheckIcon className="w-5 h-5" />
              حفظ التغييرات
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CourseEditor;