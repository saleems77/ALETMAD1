// ThemePreview.jsx
'use client';
import React from 'react';
import { useBrandStore } from './WhiteLabelContext';
import { FiUploadCloud } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ThemePreview() {
  const { brand } = useBrandStore();
  const { logo, primaryColor, font, secondaryColor } = brand || {};

  return (
    <motion.div 
      className="theme-preview p-6 border rounded-xl bg-white dark:bg-gray-800 shadow-lg"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
    >
      {/* Logo Preview */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">معاينة الشعار</h3>
        <div className="w-full aspect-video bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center">
          {logo ? (
            <img 
              src={logo} 
              alt="Logo" 
              className="max-h-32 object-contain p-4 transition-opacity hover:opacity-80"
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <FiUploadCloud className="w-12 h-12 mb-2" />
              <span>قم برفع الشعار</span>
            </div>
          )}
        </div>
      </div>

      {/* Color Palette Preview */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">الألوان</h3>
        <div className="flex gap-3">
          <div 
            className="w-12 h-12 rounded-lg shadow-md"
            style={{ backgroundColor: primaryColor }}
          />
          <div 
            className="w-12 h-12 rounded-lg shadow-md"
            style={{ backgroundColor: secondaryColor }}
          />
        </div>
      </div>

      {/* Typography Preview */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">الخطوط</h3>
        <div 
          className="text-3xl font-bold p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
          style={{ fontFamily: font }}
        >
          Aa
        </div>
      </div>

      {/* UI Elements Preview */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-4">عناصر الواجهة</h3>
        <div className="space-y-4">
          <button 
            className="btn px-6 py-2 rounded-lg transition-all"
            style={{ 
              backgroundColor: primaryColor,
              color: getContrastColor(primaryColor)
            }}
          >
            زر أساسي
          </button>
          
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              borderColor: secondaryColor,
              backgroundColor: addAlpha(secondaryColor, 0.1)
            }}
          >
            <p style={{ color: secondaryColor }}>هذا تنبيه مهم</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper functions
function getContrastColor(hex) {
  if (!hex || typeof hex !== 'string') return '#fff'; // التحقق الشامل [[1]][[2]]
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, ''); // تنظيف القيمة [[6]]
  if (cleanHex.length !== 6) return '#000'; // التحقق من الطول [[8]]  // إصلاح خطأ التركيب هنا
  const r = parseInt(hex.substr(1, 2), 16); // إضافة radix 16
  const g = parseInt(hex.substr(3, 2), 16); // تفكيك المتغيرات
  const b = parseInt(hex.substr(5, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#000' : '#fff';
}

// إصلاح دالة إضافة الشفافية
function addAlpha(color = '#000000', alpha = 1) { // قيم افتراضية [[5]]
  const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const matches = color.match(hexRegex);
  
  if (!matches) return `rgba(0,0,0,${alpha})`; // معالجة الأخطاء [[1]]
  
  const r = parseInt(matches[1], 16);
  const g = parseInt(matches[2], 16);
  const b = parseInt(matches[3], 16);
  return `rgba(${r},${g},${b},${alpha})`;
}