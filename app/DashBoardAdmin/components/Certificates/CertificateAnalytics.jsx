'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { Spin, Select } from 'antd';

// بيانات وهمية للتحليلات
const mockAnalyticsData = {
  monthly: [
    { month: 'يناير', certificates: 45 },
    { month: 'فبراير', certificates: 65 },
    { month: 'مارس', certificates: 85 },
    { month: 'أبريل', certificates: 55 },
  ],
  byCourse: [
    { course: 'تطوير الويب', certificates: 120 },
    { course: 'أمن المعلومات', certificates: 85 },
    { course: 'الذكاء الاصطناعي', certificates: 65 },
  ]
};

export default function CertificateAnalytics() {
  const [loading, setLoading] = useState(true);
  const [dataType, setDataType] = useState('monthly');
  const [data, setData] = useState([]);

  useEffect(() => {
    // محاكاة جلب البيانات من API
    setTimeout(() => {
      setData(mockAnalyticsData[dataType]);
      setLoading(false);
    }, 1000);
  }, [dataType]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">تحليلات الشهادات</h3>
        <Select
          defaultValue="monthly"
          style={{ width: 200 }}
          onChange={(value) => {
            setDataType(value);
            setLoading(true);
          }}
          options={[
            { value: 'monthly', label: 'حسب الشهر' },
            { value: 'byCourse', label: 'حسب الدورة' },
          ]}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={dataType === 'monthly' ? 'month' : 'course'} 
                tick={{ fontSize: 14 }}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  border: 'none', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar 
                dataKey="certificates" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                name="عدد الشهادات"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-blue-600 font-medium">الإجمالي هذا الشهر</h4>
          <p className="text-3xl font-bold mt-2">85</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-green-600 font-medium">أعلى دورة</h4>
          <p className="text-xl mt-2">تطوير الويب</p>
          <p className="text-gray-600">120 شهادة</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-purple-600 font-medium">متوسط الإصدار اليومي</h4>
          <p className="text-3xl font-bold mt-2">2.8</p>
        </div>
      </div>
    </div>
  );
}