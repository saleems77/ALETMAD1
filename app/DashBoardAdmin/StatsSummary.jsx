import React from 'react';

const StatsSummary = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">إجمالي المستخدمين</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <span className="text-3xl">👤</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">الدورات المنشورة</p>
            <p className="text-3xl font-bold">{stats.totalCourses}</p>
          </div>
          <span className="text-3xl">📚</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">الإيرادات الكلية</p>
            <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()} SAR</p>
          </div>
          <span className="text-3xl">💵</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">نسبة التفاعل</p>
            <p className="text-3xl font-bold">{stats.engagementRate}%</p>
          </div>
          <span className="text-3xl">📊</span>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;