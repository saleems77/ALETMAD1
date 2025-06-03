// components/agent/Analytics/CampaignStats.jsx
'use client';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// بيانات افتراضية
const dummyData = {
  campaigns: [
    {
      id: 1,
      name: 'حملة الشتاء التعليمية',
      stats: {
        visits: 2450,
        clicks: 1580,
        conversions: 324,
        commissions: 4860
      },
      chartData: [
        { day: 'السبت', visits: 400, clicks: 240 },
        { day: 'الأحد', visits: 300, clicks: 139 },
        { day: 'الإثنين', visits: 600, clicks: 400 },
        { day: 'الثلاثاء', visits: 500, clicks: 300 },
        { day: 'الأربعاء', visits: 700, clicks: 480 },
      ]
    },
    // يمكن إضافة المزيد من الحملات هنا
  ]
};

const StatsCard = ({ title, value, icon, trend, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`${color} p-4 rounded-full`}>
        {icon}
      </div>
    </div>
    <div className="mt-4">
      <span className={`text-sm ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {trend} عن الشهر الماضي
      </span>
    </div>
  </div>
);

const CampaignStatsChart = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">أداء الحملة خلال الأسبوع</h3>
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip 
          contentStyle={{ 
            border: 'none', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            direction: 'rtl'
          }}
        />
        <Bar 
          dataKey="visits" 
          fill="#4f46e5" 
          radius={[4, 4, 0, 0]}
          name="الزيارات"
        />
        <Bar 
          dataKey="clicks" 
          fill="#10b981" 
          radius={[4, 4, 0, 0]}
          name="النقرات"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default function CampaignStatistics() {
  const [selectedCampaign, setSelectedCampaign] = useState(dummyData.campaigns[0]);

  return (
    <div className="space-y-6">
      {/* عناصر التحكم */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">إحصاءات الحملات التسويقية</h2>
        <select 
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setSelectedCampaign(dummyData.campaigns.find(c => c.id === parseInt(e.target.value)))}
        >
          {dummyData.campaigns.map(campaign => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="الزيارات"
          value={selectedCampaign.stats.visits.toLocaleString()}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>}
          trend="+12.4%"
          color="bg-indigo-100 text-indigo-600"
        />
        
        <StatsCard
          title="النقرات"
          value={selectedCampaign.stats.clicks.toLocaleString()}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
               </svg>}
          trend="+8.2%"
          color="bg-green-100 text-green-600"
        />

        <StatsCard
          title="التحويلات"
          value={selectedCampaign.stats.conversions.toLocaleString()}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
               </svg>}
          trend="+5.7%"
          color="bg-purple-100 text-purple-600"
        />

        <StatsCard
          title="العمولات"
          value={`$${selectedCampaign.stats.commissions.toLocaleString()}`}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>}
          trend="+23.1%"
          color="bg-orange-100 text-orange-600"
        />
      </div>

      {/* الرسوم البيانية */}
      <CampaignStatsChart data={selectedCampaign.chartData} />
    </div>
  );
}