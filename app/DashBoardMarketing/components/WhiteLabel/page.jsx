// BrandingSystem.jsx
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrandStore } from './WhiteLabelContext';
import BrandingPage from './BrandingPage';
import BrandSettingsSidebar from './BrandSettingsSidebar';
import BrandExportPanel from './BrandExportPanel';
import { FiSettings, FiEye, FiDownload, FiCheckCircle } from 'react-icons/fi';

import { TbBrandTabler, TbPalette } from 'react-icons/tb'; // تعديل الاسم هنا

export default function BrandingSystem() {
  const [activeTab, setActiveTab] = useState('editor');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { brand } = useBrandStore();
  const [exportSuccess, setExportSuccess] = useState(false);

  // تطبيق الهوية البصرية على النظام
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', brand?.primaryColor || '#4F46E5');
    document.documentElement.style.setProperty('--secondary-color', brand?.secondaryColor || '#10B981');
    document.documentElement.style.setProperty('--font-family', brand?.font || 'Inter');
  }, [brand]);

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
    // هنا يمكن إضافة منطق التصدير الفعلي
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* شريط التنقل العلوي */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TbBrandTabler className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">نظام الهوية البصرية</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiSettings />
              الإعدادات
            </button>
            
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
            >
              {exportSuccess ? <FiCheckCircle /> : <FiDownload />}
              {exportSuccess ? 'تم التصدير!' : 'تصدير الهوية'}
            </button>
          </div>
        </div>
        
        {/* شريط التبويبات */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto flex">
            <button
              className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'editor' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('editor')}
            >
              <TbPalette />
              محرر الهوية
            </button>
            <button
              className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'preview' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('preview')}
            >
              <FiEye />
              المعاينة الكاملة
            </button>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'editor' ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BrandingPage />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6">معاينة الهوية البصرية</h2>
              <div className="space-y-8">
                {/* هنا يمكن إضافة معاينة كاملة للهوية */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">تطبيق الهوية على الموقع</h3>
                  <div className="p-6 rounded-lg border" style={{ borderColor: brand?.primaryColor }}>
                    <p style={{ color: brand?.primaryColor }} className="mb-2">هذا النص بلون الهوية الأساسي</p>
                    <button 
                      className="px-4 py-2 rounded-lg"
                      style={{ 
                        backgroundColor: brand?.primaryColor,
                        color: getContrastColor(brand?.primaryColor)
                      }}
                    >
                      زر نموذجي
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* لوحة الإعدادات الجانبية */}
      <AnimatePresence>
        {isSettingsOpen && (
          <BrandSettingsSidebar onClose={() => setIsSettingsOpen(false)} />
        )}
      </AnimatePresence>

      {/* لوحة التصدير */}
      <BrandExportPanel 
        isOpen={exportSuccess} 
        onClose={() => setExportSuccess(false)} 
      />
    </div>
  );
}

// دالة مساعدة لتحديد لون النص المناسب
function getContrastColor(hex) {
  if (!hex) return '#fff';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#000' : '#fff';
}