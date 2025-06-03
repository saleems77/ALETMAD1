'use client';
import { useState } from 'react';
import { Tabs, Tab, Button, Spacer } from '@nextui-org/react';
import { 
  FiPlus, 
  FiFilter, 
  FiUpload, 
  FiDownload,
  FiSettings
} from 'react-icons/fi';
import { useLicenseStore } from './LicenseContext';
import InstitutionTable from './InstitutionTable';
import InstitutionForm from './InstitutionForm';
import LicenseAllocation from './LicenseAllocation';
import BulkActions from './BulkActions';
import AdvancedFilters from './AdvancedFilters';
import { motion } from 'framer-motion';

export default function InstitutionManagement() {
  const { institutions } = useLicenseStore();
  const [selectedTab, setSelectedTab] = useState('list');
  const [showFilters, setShowFilters] = useState(false);

  const stats = {
    total: institutions.length,
    active: institutions.filter(i => i.status === 'active').length,
    suspended: institutions.filter(i => i.status === 'suspended').length
  };

  return (
    <div className="space-y-6 p-4">
      {/* شريط الإحصائيات العلوي */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatCard 
          label="إجمالي المراكز"
          value={stats.total}
          icon="🏛️"
          color="bg-blue-100"
          trend="+12% عن الشهر الماضي"
        />
        <StatCard 
          label="نشطة حالياً"
          value={stats.active}
          icon="✅"
          color="bg-green-100"
          trend="+5 اشتراكات جديدة"
        />
        <StatCard 
          label="معلقة"
          value={stats.suspended}
          icon="⛔"
          color="bg-red-100"
          trend="3 حالات هذا الشهر"
        />
      </motion.div>

      {/* شريط التحكم الرئيسي */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Tabs 
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
          variant="underlined"
          color="primary"
          classNames={{
            tabList: "gap-4",
            cursor: "bg-primary-500"
          }}
        >
          <Tab 
            key="list" 
            title={
              <div className="flex items-center gap-2">
                <span>📋</span>
                قائمة المراكز
              </div>
            }
          />
          <Tab 
            key="new" 
            title={
              <div className="flex items-center gap-2">
                <FiPlus />
                تسجيل جديد
              </div>
            }
          />
          <Tab 
            key="settings" 
            title={
              <div className="flex items-center gap-2">
                <FiSettings />
                الإعدادات
              </div>
            }
          />
        </Tabs>

        <div className="flex gap-2 items-start">
          <Button 
            variant="bordered" 
            startContent={<FiFilter />}
            onClick={() => setShowFilters(!showFilters)}
          >
            الفلاتر
          </Button>
          <Button 
            color="primary" 
            startContent={<FiDownload />}
            onClick={() => exportToExcel(institutions)}
          >
            تصدير Excel
          </Button>
        </div>
      </div>

      {/* منطقة الفلاتر */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <AdvancedFilters />
        </motion.div>
      )}

      {/* المحتوى الرئيسي */}
      <div className="space-y-6">
        {selectedTab === 'list' ? (
          <>
            <BulkActions />
            <InstitutionTable />
          </>
        ) : selectedTab === 'new' ? (
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-bold mb-6">تسجيل مؤسسة جديدة</h3>
              <InstitutionForm />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-bold mb-6">تخصيص الرخص</h3>
              <LicenseAllocation />
            </motion.div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-6">إعدادات النظام</h3>
            {/* إضافة محتوى الإعدادات هنا */}
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon, color, trend }) => (
  <div className={`${color} p-4 rounded-xl flex items-center justify-between`}>
    <div>
      <div className="text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      {trend && <div className="text-sm mt-1 text-gray-500">{trend}</div>}
    </div>
    <span className="text-3xl">{icon}</span>
  </div>
);

const exportToExcel = (data) => {
  // تنفيذ منطق التصدير إلى Excel هنا
  console.log('Exporting data:', data);
};