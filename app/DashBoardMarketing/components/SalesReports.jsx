// components/agent/Reports/SalesReports.jsx
'use client';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// بيانات افتراضية
const reportData = {
  monthly: [
    { month: 'يناير', sales: 24000, conversion: 15, commission: 3600 },
    { month: 'فبراير', sales: 31800, conversion: 18, commission: 4770 },
    { month: 'مارس', sales: 29500, conversion: 22, commission: 4425 },
    { month: 'أبريل', sales: 41000, conversion: 25, commission: 6150 },
  ],
  campaigns: [
    { id: 1, name: 'حملة الشتاء', type: 'دورات تعليمية', sales: 15600 },
    { id: 2, name: 'عروض البرمجة', type: 'باقات مكثفة', sales: 23400 },
    { id: 3, name: 'التسويق الرقمي', type: 'ورش عمل', sales: 18200 },
  ]
};

const FilterButton = ({ active, children, ...props }) => (
  <button 
    {...props}
    className={`px-4 py-2 rounded-lg text-sm ${
      active 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const ReportChart = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">المبيعات الشهرية</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tick={{ fill: '#6b7280' }} 
          />
          <YAxis 
            axisLine={false} 
            tickFormatter={(value) => `$${value / 1000}k`}
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{
              background: '#fff',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar 
            dataKey="sales" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            name="المبيعات"
          />
          <Bar 
            dataKey="commission" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]}
            name="العمولات"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const SalesTable = ({ data }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">الحملة</th>
          <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">النوع</th>
          <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">المبيعات</th>
          <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">نسبة التحويل</th>
          <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">العمولة</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((item) => (
          <tr key={item.id}>
            <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{item.type}</td>
            <td className="px-6 py-4 text-sm text-gray-600">${item.sales.toLocaleString()}</td>
            <td className="px-6 py-4 text-sm text-blue-600 font-medium">
              {Math.floor((item.sales / 50000) * 100)}%
            </td>
            <td className="px-6 py-4 text-sm text-green-600 font-medium">
              ${(item.sales * 0.15).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function SalesReports() {
  const [dateRange, setDateRange] = useState('3months');
  const [campaignType, setCampaignType] = useState('all');

  const filteredData = reportData.monthly.filter(item => {
    return campaignType === 'all' || item.type === campaignType;
  });

  // حساب متوسط التحويل
  const averageConversion = Math.round(
    reportData.monthly.reduce((sum, item) => sum + item.conversion, 0) / 
    reportData.monthly.length
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">تقارير المبيعات والعمولات</h2>
        
        <div className="flex items-center gap-3">
          <select 
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="3months">آخر 3 أشهر</option>
            <option value="6months">آخر 6 أشهر</option>
            <option value="year">هذا العام</option>
          </select>

          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <FilterButton 
              active={campaignType === 'all'}
              onClick={() => setCampaignType('all')}
            >
              الكل
            </FilterButton>
            <FilterButton 
              active={campaignType === 'دورات تعليمية'}
              onClick={() => setCampaignType('دورات تعليمية')}
            >
              دورات
            </FilterButton>
            <FilterButton 
              active={campaignType === 'ورش عمل'}
              onClick={() => setCampaignType('ورش عمل')}
            >
              ورش
            </FilterButton>
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <ArrowDownTrayIcon className="w-5 h-5" />
            تصدير
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* بطاقات الإحصاءات السريعة */}
        <div className="bg-blue-600 text-white p-6 rounded-xl lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">إجمالي العمولات</h3>
          <p className="text-3xl font-bold">
            ${reportData.monthly.reduce((sum, item) => sum + item.commission, 0).toLocaleString()}
          </p>
          <p className="text-sm mt-2 opacity-90">+12.4% عن الفترة السابقة</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">متوسط نسبة التحويل</h3>
          <p className="text-3xl font-bold text-green-600">
            {averageConversion}%
          </p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-green-500 rounded-full" 
              style={{ width: '65%' }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">أعلى الحملات أداءً</h3>
          <div className="space-y-4">
            {reportData.campaigns.map((campaign) => (
              <div key={campaign.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{campaign.name}</p>
                  <p className="text-sm text-gray-600">{campaign.type}</p>
                </div>
                <span className="text-blue-600 font-medium">${campaign.sales.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReportChart data={filteredData} />
      <SalesTable data={reportData.campaigns} />
    </div>
  );
}