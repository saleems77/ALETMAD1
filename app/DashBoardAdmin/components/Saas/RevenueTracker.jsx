'use client';
import { useLicenseStore } from './LicenseContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiCalendar } from 'react-icons/fi';

export default function RevenueTracker() {
  const { licenses, clients } = useLicenseStore();
  const [timeRange, setTimeRange] = useState('monthly');
  
  // معالجة البيانات للإحصائيات
  const calculateRevenueData = () => {
    const monthlyRevenue = {};
    const planRevenue = { basic: 0, pro: 0, enterprise: 0 };
    
    licenses.forEach(license => {
      const month = new Date(license.purchaseDate).toLocaleString('ar-EG', { month: 'long' });
      const amount = license.plan === 'pro' ? 299 : license.plan === 'enterprise' ? 499 : 99;
      
      // تجميع الإيرادات الشهرية
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + amount;
      
      // تجميع الإيرادات حسب الخطة
      planRevenue[license.plan] += amount;
    });

    return {
      monthlyData: Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue })),
      planData: Object.entries(planRevenue).map(([plan, revenue]) => ({ plan, revenue })),
      totalRevenue: licenses.reduce((sum, l) => sum + (l.plan === 'pro' ? 299 : l.plan === 'enterprise' ? 499 : 99), 0),
      activeSubscriptions: clients.filter(c => c.status === 'active').length
    };
  };

  const { monthlyData, planData, totalRevenue, activeSubscriptions } = calculateRevenueData();

  // حساب متوسط الإيراد لكل عميل
  const arpu = activeSubscriptions > 0 ? (totalRevenue / activeSubscriptions).toFixed(2) : 0;

  return (
    <div className="card bg-base-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FiDollarSign /> تتبع الإيرادات
        </h3>
        <select 
          className="select select-bordered select-sm"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="monthly">شهري</option>
          <option value="quarterly">ربع سنوي</option>
          <option value="yearly">سنوي</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">الإيرادات الإجمالية</div>
            <div className="stat-value">${totalRevenue}</div>
            <div className="stat-desc flex items-center gap-1">
              <FiTrendingUp /> +12% عن الشهر الماضي
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">الاشتراكات النشطة</div>
            <div className="stat-value">{activeSubscriptions}</div>
            <div className="stat-desc">+5 اشتراكات جديدة</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">متوسط الإيراد (ARPU)</div>
            <div className="stat-value">${arpu}</div>
            <div className="stat-desc">لكل مركز/مستخدم</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold mb-4">الاتجاه الشهري للإيرادات</h4>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold mb-4">التوزيع حسب الخطة</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={planData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plan" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <FiCalendar /> التجديدات القادمة (7 أيام)
        </h4>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>المركز</th>
                <th>الخطة</th>
                <th>تاريخ التجديد</th>
                <th>القيمة المتوقعة</th>
              </tr>
            </thead>
            <tbody>
              {clients.filter(c => c.status === 'active').slice(0, 5).map(client => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.plan}</td>
                  <td>{new Date(client.expiryDate).toLocaleDateString()}</td>
                  <td>${client.plan === 'pro' ? 299 : 99}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}