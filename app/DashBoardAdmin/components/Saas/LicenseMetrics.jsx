'use client';

import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';

const LicenseMetrics = () => {
  // بيانات تجريبية للمقاييس، يمكنك تحديثها لتصبح مُستمدة من مصدر بيانات
  const metrics = [
    { label: 'إجمالي الرخص', value: 120 },
    { label: 'الرخص النشطة', value: 95 },
    { label: 'الرخص منتهية الصلاحية', value: 25 },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FiBarChart2 className="mr-2" /> مقاييس الرخص
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 border rounded text-center">
            <div className="text-2xl font-semibold">{metric.value}</div>
            <div className="text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LicenseMetrics;
