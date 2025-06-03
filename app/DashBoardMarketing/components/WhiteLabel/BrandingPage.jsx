// BrandingPage.jsx
"use client";
import BrandForm from './BrandForm';
import ThemePreview from './ThemePreview';
import { TbBrandTabler, TbPalette } from 'react-icons/tb';
import { motion } from 'framer-motion';

export default function BrandingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid md:grid-cols-2 gap-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <TbBrandTabler className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            تخصيص الهوية البصرية
          </h1>
        </div>
        <BrandForm />
      </div>
      
      <div className="sticky top-6 h-fit">
        <div className="flex items-center gap-3 mb-6">
          <TbPalette className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            المعاينة الحية
          </h2>
        </div>
        <ThemePreview />
      </div>
    </motion.div>
  );
}