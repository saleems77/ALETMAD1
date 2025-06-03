'use client';
import { Tabs, Badge, Statistic, Table, Button } from 'antd';
import CertificateList from './CertificateList';
import CertificateGenerator from './CertificateGenerator';
import CertificateAnalytics from './CertificateAnalytics';
import PendingApprovals from './PendingApprovals';

export default function CertificatesDashboard() {
  const items = [
    {
      key: '1',
      label: 'الشهادات المولدة',
      children: <CertificateList />,
    },
    {
      key: '2',
      label: 'إنشاء شهادة جديدة',
      children: <CertificateGenerator />,
    },
    {
      key: '3',
      label: <Badge count={5}>الطلبات المعلقة</Badge>,
      children: <PendingApprovals />,
    },
    {
      key: '4',
      label: 'الإحصائيات',
      children: <CertificateAnalytics />,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">لوحة إدارة الشهادات</h1>
        <div className="flex gap-6 mt-4">
          <DashboardStat title="الشهادات الصادرة" value={245} />
          <DashboardStat title="في انتظار الموافقة" value={12} />
          <DashboardStat title="الإيرادات" value={15800} prefix="ر.س" />
        </div>
      </div>
      
      <Tabs 
        defaultActiveKey="1" 
        items={items}
        tabBarExtraContent={<Button type="primary">تصدير التقارير</Button>}
      />
    </div>
  );
};

const DashboardStat = ({ title, value, prefix }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex-1">
    <Statistic
      title={title}
      value={value}
      prefix={prefix}
      valueStyle={{ color: '#3f8600' }}
    />
  </div>
);

