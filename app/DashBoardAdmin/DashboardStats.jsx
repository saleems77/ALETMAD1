import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsSummary from './StatsSummary';
import StatCard from './StatCard';

const DashboardStats = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* البطاقات الإحصائية */}
      <StatsSummary stats={data.stats} />

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">النمو الشهري</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.charts.monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#2563eb" name="المستخدمين" />
                <Line type="monotone" dataKey="courses" stroke="#16a34a" name="الدورات" />
                <Line type="monotone" dataKey="revenue" stroke="#ea580c" name="الإيرادات (آلاف)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">مصادر الإيرادات</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.revenueSources}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#2563eb" name="المبلغ (SAR)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* بطاقات النسب المئوية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="نسبة التفاعل" 
          value={data.stats.engagementRate} 
          unit="%"
          color="bg-blue-100 text-blue-800"
          icon="📈"
        />
        <StatCard 
          title="نسبة إكمال الدورات" 
          value={data.stats.completionRate} 
          unit="%"
          color="bg-green-100 text-green-800"
          icon="🎓"
        />
        <StatCard 
          title="المستخدمين النشطين" 
          value={data.stats.activeUsers} 
          unit="مستخدم"
          color="bg-purple-100 text-purple-800"
          icon="👥"
        />
      </div>
    </div>
  );
};

export default DashboardStats;