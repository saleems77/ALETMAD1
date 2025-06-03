// components/ChartProgressBar.jsx
"use client"
import React from 'react';
import { motion } from 'framer-motion';

const ChartProgressBar = ({ data }) => {
  // حساب إحصائيات الأداء
  const totalViews = data?.reduce((acc, curr) => acc + curr.views, 0) || 0;
  const totalConversions = data?.reduce((acc, curr) => acc + curr.conversions, 0) || 0;
  const conversionRate = totalViews > 0 
    ? ((totalConversions / totalViews) * 100).toFixed(1)
    : 0;

  return (
    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-gray-200">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">معدل التحويل</span>
          <span className="text-blue-600 font-medium">{conversionRate}%</span>
        </div>
        
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${conversionRate}%` }}
          transition={{ duration: 0.8 }}
          className="h-2 bg-blue-100 rounded-full overflow-hidden"
        >
          <div className="h-full bg-blue-600 rounded-full transition-all duration-500" />
        </motion.div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <div className="text-gray-600">
              <span>الزيارات: </span>
              <span className="font-medium">{totalViews.toLocaleString('ar-EG')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="text-gray-600">
              <span>التحويلات: </span>
              <span className="font-medium">{totalConversions.toLocaleString('ar-EG')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartProgressBar;