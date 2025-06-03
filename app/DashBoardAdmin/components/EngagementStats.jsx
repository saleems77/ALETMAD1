// components/EngagementStats.jsx
'use client';
import { FiUsers, FiClock, FiActivity } from 'react-icons/fi';

const dummyEngagement = {
  totalVisitors: 1245,
  averageTime: '12:34',
  topPage: '/courses/web-development'
};

export default function EngagementStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow flex items-center">
        <FiUsers className="text-3xl text-blue-600 mr-4" />
        <div>
          <p className="text-gray-500">إجمالي الزوار</p>
          <p className="text-2xl font-bold">{dummyEngagement.totalVisitors}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow flex items-center">
        <FiClock className="text-3xl text-green-600 mr-4" />
        <div>
          <p className="text-gray-500">متوسط مدة الجلسة</p>
          <p className="text-2xl font-bold">{dummyEngagement.averageTime}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow flex items-center">
        <FiActivity className="text-3xl text-purple-600 mr-4" />
        <div>
          <p className="text-gray-500">الصفحة الأكثر تفاعلاً</p>
          <p className="text-2xl font-bold truncate">{dummyEngagement.topPage}</p>
        </div>
      </div>
    </div>
  );
}