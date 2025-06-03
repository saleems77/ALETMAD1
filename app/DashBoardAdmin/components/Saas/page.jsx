// src/app/(admin)/dashboard/page.jsx
'use client';
import { Tabs, Tab } from '@nextui-org/react';
import { Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard,
  Building2,
  WalletCards,
  ShieldCheck,
  LineChart,
  Settings 
} from 'lucide-react';
import LicenseDashboard from './LicenseDashboard';
import InstitutionManagement from './InstitutionManagement';
import SubscriptionControl from './SubscriptionControl';
import ComplianceCenter from './ComplianceCenter';
import FinancialMonitor from './FinancialMonitor';
import SystemConfig from './SystemConfig';
import { useLicenseStore } from './LicenseContext';

// نظام الألوان المخصص
const themeColors = {
  primary: '#2B6CB0',
  secondary: '#4299E1',
  success: '#48BB78',
  warning: '#ECC94B',
  danger: '#F56565',
  background: '#F7FAFC'
};

export default function AdminConsole() {
  const { userRole } = useLicenseStore();

  // إضافة تأثيرات حركية
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.h1 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-2xl font-bold text-gray-800 flex items-center gap-2"
          >
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            نظام إدارة المراكز التعليمية
          </motion.h1>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">AD</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={tabVariants}
          transition={{ duration: 0.3 }}
        >
          <Tabs 
            aria-label="Admin Console"
            color="primary"
            variant="underlined"
            classNames={{
              tabList: "gap-6 w-full relative",
              cursor: "bg-blue-500",
              tab: "h-12 px-4",
              panel: "pt-6"
            }}
          >
            <Tab 
              key="dashboard" 
              title={
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" />
                  الرئيسية
                </div>
              }
            >
              <Suspense fallback={<LoadingSkeleton />}>
                <LicenseDashboard />
              </Suspense>
            </Tab>

            <Tab 
              key="institutions" 
              title={
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  إدارة المراكز
                </div>
              }
            >
              <Suspense fallback={<LoadingSkeleton />}>
                <InstitutionManagement />
              </Suspense>
            </Tab>

            <Tab 
              key="subscriptions" 
              title={
                <div className="flex items-center gap-2">
                  <WalletCards className="w-5 h-5" />
                  الاشتراكات
                </div>
              }
            >
              <Suspense fallback={<LoadingSkeleton />}>
                <SubscriptionControl />
              </Suspense>
            </Tab>

            <Tab 
              key="compliance" 
              title={
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  الالتزام
                </div>
              }
            >
              <Suspense fallback={<LoadingSkeleton />}>
                <ComplianceCenter />
              </Suspense>
            </Tab>

            <Tab 
              key="financial" 
              title={
                <div className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  التقارير المالية
                </div>
              }
            >
              <Suspense fallback={<LoadingSkeleton />}>
                <FinancialMonitor />
              </Suspense>
            </Tab>

            {userRole === 'super-admin' && (
              <Tab 
                key="config" 
                title={
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    الإعدادات
                  </div>
                }
              >
                <Suspense fallback={<LoadingSkeleton />}>
                  <SystemConfig />
                </Suspense>
              </Tab>
            )}
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="h-32 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg animate-pulse" />
    <div className="grid grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-white rounded-lg shadow-sm animate-pulse" />
      ))}
    </div>
  </div>
);