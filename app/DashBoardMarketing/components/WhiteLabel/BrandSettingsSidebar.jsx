"use client";
import { motion } from 'framer-motion';

export default function BrandSettingsSidebar({ onClose }) {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30 }}
      className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-xl z-20 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">إعدادات النظام</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block mb-2">وضع العرض</label>
          <select className="w-full p-2 border rounded-lg">
            <option value="light">فاتح</option>
            <option value="dark">مظلم</option>
            <option value="auto">تلقائي</option>
          </select>
        </div>
        
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            حفظ التغييرات تلقائياً
          </label>
        </div>
      </div>
    </motion.div>
  );
}