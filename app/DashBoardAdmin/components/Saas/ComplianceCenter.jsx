'use client';
import { 
  Tabs, 
  Tab,
  Card,
  Progress,
  Tooltip,
  Spinner
} from '@nextui-org/react';
import { 
  FiAlertTriangle,
  FiActivity,
  FiClock,
  FiBarChart2,
  FiRefreshCw
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useLicenseStore } from './LicenseContext';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const ComplianceChart = dynamic(() => import('./ComplianceChart'), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-xl animate-pulse" />
});

export default function ComplianceCenter() {
  const { complianceStats, loadComplianceStats } = useLicenseStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('stats');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadComplianceStats();
    } finally {
      setIsRefreshing(false);
    }
  };

  const stats = [
    {
      title: "المراكز المعلقة",
      value: complianceStats?.suspended || 0,
      icon: <FiAlertTriangle className="w-6 h-6" />,
      color: "bg-red-100",
      textColor: "text-red-600"
    },
    {
      title: "الانتهاكات الشهرية",
      value: complianceStats?.violations || 0,
      icon: <FiActivity className="w-6 h-6" />,
      color: "bg-yellow-100",
      textColor: "text-yellow-600"
    },
    {
      title: "معدل الامتثال",
      value: complianceStats?.complianceRate || 0,
      icon: <FiBarChart2 className="w-6 h-6" />,
      color: "bg-green-100",
      textColor: "text-green-600",
      isPercentage: true
    }
  ];

  if (!complianceStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 space-y-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
            <div className="h-12 bg-gray-100 rounded animate-pulse" />
          </Card>
        ))}
      </div>
    );
  }

  if (complianceStats.error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl flex items-center gap-4">
        <FiAlertTriangle className="text-red-600 w-8 h-8 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-red-600">خطأ في تحميل البيانات</h3>
          <p className="text-red-500 mt-1">{complianceStats.error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <FiActivity className="text-blue-500" />
          مركز الرقابة والالتزام
        </h2>
        <Button
          isIconOnly
          variant="light"
          onClick={handleRefresh}
          isLoading={isRefreshing}
        >
          <FiRefreshCw className="w-5 h-5" />
        </Button>
      </div>

      <Tabs 
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
        variant="underlined"
        color="primary"
      >
        <Tab 
          key="stats" 
          title={
            <div className="flex items-center gap-2">
              <FiBarChart2 />
              الإحصائيات
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${stat.color} p-6 rounded-xl`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-600">{stat.title}</div>
                      <div className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                        {stat.isPercentage ? `${stat.value}%` : stat.value}
                      </div>
                    </div>
                    <span className={`${stat.textColor} p-2 rounded-lg`}>
                      {stat.icon}
                    </span>
                  </div>
                  {stat.isPercentage && (
                    <Progress
                      value={stat.value}
                      color="primary"
                      className="mt-4"
                      classNames={{ track: "bg-gray-200" }}
                    />
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-6">الاتجاهات الشهرية</h3>
            <div className="h-80">
              <ComplianceChart data={complianceStats.trends} />
            </div>
          </div>
        </Tab>

        <Tab 
          key="actions" 
          title={
            <div className="flex items-center gap-2">
              <FiAlertTriangle />
              الإجراءات
            </div>
          }
        >
          <div className="grid md:grid-cols-2 gap-6">
            <SuspensionManager />
            <ActivityMonitor />
          </div>
        </Tab>

        <Tab 
          key="history" 
          title={
            <div className="flex items-center gap-2">
              <FiClock />
              السجل الزمني
            </div>
          }
        >
          <ComplianceGrid />
        </Tab>
      </Tabs>
    </motion.div>
  );
}