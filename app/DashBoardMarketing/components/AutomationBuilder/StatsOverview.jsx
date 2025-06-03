"use client"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FiArrowUpRight, FiMail, FiUsers } from 'react-icons/fi';
import { useState } from 'react';
const mockStats = [
  { name: 'Jan', emails: 2400, opens: 1400 },
  { name: 'Feb', emails: 3200, opens: 2100 },
  { name: 'Mar', emails: 1800, opens: 1500 },
  { name: 'Apr', emails: 4100, opens: 3200 },
  { name: 'May', emails: 2900, opens: 2600 },
];

export default function StatsOverview() {
  const [selectedMetric, setSelectedMetric] = useState('emails');

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">إحصائيات الحملات</h3>
        <select 
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="select select-bordered"
        >
          <option value="emails">إرسالات البريد</option>
          <option value="opens">معدل الفتح</option>
          <option value="clicks">معدل النقر</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<FiMail className="w-6 h-6" />}
          title="إجمالي الحملات"
          value="24"
          trend="12%"
        />
        <StatCard 
          icon={<FiUsers className="w-6 h-6" />}
          title="معدل المشاركة"
          value="58%"
          trend="8%"
        />
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockStats}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey={selectedMetric}
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value, trend }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-green-500 flex items-center">
            <FiArrowUpRight className="mr-1" /> {trend}
          </span>
        </div>
      </div>
    </div>
  </div>
);