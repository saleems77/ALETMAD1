// AdReports.jsx
"use client";
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdReports = ({ campaigns = [], adSets = [], ads = [], advertiserAccounts = [] }) => {
  // Calculate monthly statistics
  const monthlyStats = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const campaignCount = campaigns.filter(c => new Date(c.startDate).getMonth() + 1 === month).length;
    const adSetCount = adSets.filter(a => new Date(a.schedule.startDate).getMonth() + 1 === month).length;
    const adCount = ads.length; // We don't have date information for ads in the provided data
    
    return {
      name: new Date(2023, i, 1).toLocaleString('ar-SA', { month: 'short' }),
      campaigns: campaignCount,
      adSets: adSetCount,
      ads: adCount
    };
  });

  // Calculate campaign status distribution
  const statusDistribution = [
    { name: 'نشط', value: campaigns.filter(c => c.status === 'active').length },
    { name: 'قيد المراجعة', value: campaigns.filter(c => c.status === 'pending').length },
    { name: 'منتهي', value: campaigns.filter(c => c.status === 'ended').length }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">تقارير النظام</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">أداء النظام على مدار السنة</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="campaigns" stroke="#3B82F6" name="الحملات" />
                <Line type="monotone" dataKey="adSets" stroke="#10B981" name="المجموعات" />
                <Line type="monotone" dataKey="ads" stroke="#F59E0B" name="الإعلانات" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">توزيع الحملات حسب الحالة</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" name="العدد" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">إحصائيات تفصيلية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">إجمالي الحملات</p>
            <p className="text-2xl font-bold">{campaigns.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-green-800">إجمالي المجموعات</p>
            <p className="text-2xl font-bold">{adSets.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p className="text-sm text-purple-800">إجمالي الإعلانات</p>
            <p className="text-2xl font-bold">{ads.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <p className="text-sm text-yellow-800">إجمالي المعلنين</p>
            <p className="text-2xl font-bold">{advertiserAccounts.length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">تفاصيل الحملات</h2>
        {campaigns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">العنوان</th>
                  <th className="px-4 py-2 text-left">الوصف</th>
                  <th className="px-4 py-2 text-left">الميزانية</th>
                  <th className="px-4 py-2 text-left">التاريخ</th>
                  <th className="px-4 py-2 text-left">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{campaign.title}</td>
                    <td className="px-4 py-2">{campaign.description}</td>
                    <td className="px-4 py-2">{campaign.budget} ر.س</td>
                    <td className="px-4 py-2">
                      {new Date(campaign.startDate).toLocaleDateString('ar-SA')} - 
                      {new Date(campaign.endDate).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-4 py-2">
                      <AdStatusBadge status={campaign.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">لا توجد بيانات لعرضها</div>
        )}
      </div>
    </div>
  );
};

export default AdReports;