"use client";
import { motion } from 'framer-motion';

export default function BrandExportPanel({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">تصدير الهوية البصرية</h2>
        <div className="space-y-4">
          <button className="w-full py-2 px-4 border rounded-lg hover:bg-gray-50">
            تصدير كملف PDF
          </button>
          <button className="w-full py-2 px-4 border rounded-lg hover:bg-gray-50">
            تصدير كحزمة تصميم
          </button>
          <button className="w-full py-2 px-4 border rounded-lg hover:bg-gray-50">
            نسخ إعدادات CSS
          </button>
        </div>
        <button 
          onClick={onClose}
          className="mt-6 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          إغلاق
        </button>
      </motion.div>
    </motion.div>
  );
}