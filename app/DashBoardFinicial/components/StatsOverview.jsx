// app/DashBoardEmployee/components/StatsOverview.jsx

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'يناير', tickets: 45, revenue: 2400 },
  { name: 'فبراير', tickets: 78, revenue: 4567 },
  { name: 'مارس', tickets: 56, revenue: 3245 },
];

const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* بطاقات الإحصائيات */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-lg">التذاكر المفتوحة</h3>
        <p className="text-3xl font-bold text-blue-600">24</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-lg">معدل الاستجابة</h3>
        <p className="text-3xl font-bold text-green-600">89%</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-lg">إيرادات اليوم</h3>
        <p className="text-3xl font-bold text-purple-600">$2,450</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-lg">المهام المعلقة</h3>
        <p className="text-3xl font-bold text-red-600">5</p>
      </div>

      {/* الرسم البياني */}
      <div className="col-span-full bg-white p-6 rounded-lg shadow-md h-96">
        <h3 className="text-xl font-semibold mb-4">الأداء الشهري</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tickets" fill="#3B82F6" />
            <Bar dataKey="revenue" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsOverview;