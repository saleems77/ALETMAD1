'use client';
import { Card, Progress, Tooltip } from "@nextui-org/react";
import { useLicenseStore } from "./LicenseContext";
import { 
  FiHome, 
  FiActivity, 
  FiAlertTriangle,
  FiDollarSign,
  FiTrendingUp,
  FiClock
} from "react-icons/fi";
import { motion } from "framer-motion";
import CountUp from "react-countup";

// أنماط الألوان المخصصة
const cardStyles = {
  total: { bg: "bg-blue-50", text: "text-blue-600", icon: <FiHome className="w-6 h-6" /> },
  active: { bg: "bg-green-50", text: "text-green-600", icon: <FiActivity className="w-6 h-6" /> },
  suspended: { bg: "bg-red-50", text: "text-red-600", icon: <FiAlertTriangle className="w-6 h-6" /> },
  revenue: { bg: "bg-purple-50", text: "text-purple-600", icon: <FiDollarSign className="w-6 h-6" /> }
};

export default function LicenseDashboard() {
  const { institutions, systemSettings, complianceStats } = useLicenseStore();

  // حساب الإحصائيات
  const stats = {
    total: institutions.length,
    active: institutions.filter(inst => inst.status === 'active').length,
    suspended: institutions.filter(inst => inst.status === 'suspended').length,
    monthlyRevenue: institutions.reduce((sum, inst) => sum + 
      (inst.plan === 'pro' ? 299 : inst.plan === 'enterprise' ? 499 : 99), 0),
    activityTrend: complianceStats?.activityTrend || 0
  };

  // تأثيرات الحركة
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {/* بطاقة إجمالي المراكز */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <Card 
          className={`${cardStyles.total.bg} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500 mb-2">إجمالي المراكز</div>
              <div className="text-3xl font-bold mb-2">
                <CountUp end={stats.total} duration={1.5} />
              </div>
            </div>
            <span className={`${cardStyles.total.text}`}>
              {cardStyles.total.icon}
            </span>
          </div>
          <Progress 
            size="sm" 
            value={stats.total} 
            classNames={{ track: "bg-blue-100" }}
          />
        </Card>
      </motion.div>

      {/* بطاقة المراكز النشطة */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <Card 
          className={`${cardStyles.active.bg} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500 mb-2">نشطة حالياً</div>
              <div className="text-3xl font-bold mb-2">
                <CountUp end={stats.active} duration={1.5} />
              </div>
            </div>
            <span className={`${cardStyles.active.text}`}>
              {cardStyles.active.icon}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FiTrendingUp className="text-green-500" />
            <span className="text-green-600">
              +{stats.activityTrend}% عن الشهر الماضي
            </span>
          </div>
        </Card>
      </motion.div>

      {/* بطاقة المراكز المعلقة */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <Card 
          className={`${cardStyles.suspended.bg} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500 mb-2">حالات التعليق</div>
              <div className="text-3xl font-bold mb-2">
                <CountUp end={stats.suspended} duration={1.5} />
              </div>
            </div>
            <span className={`${cardStyles.suspended.text}`}>
              {cardStyles.suspended.icon}
            </span>
          </div>
          <div className="text-sm text-red-600 flex items-center gap-2">
            <FiClock />
            {complianceStats?.lastSuspension || 'لا توجد عمليات حديثة'}
          </div>
        </Card>
      </motion.div>

      {/* بطاقة الإيرادات الشهرية */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <Card 
          className={`${cardStyles.revenue.bg} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500 mb-2">الإيرادات الشهرية</div>
              <div className="text-3xl font-bold mb-2">
                $<CountUp end={stats.monthlyRevenue} duration={2} separator="," />
              </div>
            </div>
            <span className={`${cardStyles.revenue.text}`}>
              {cardStyles.revenue.icon}
            </span>
          </div>
          <Tooltip content="يشمل جميع الباقات والترقيات">
            <div className="text-sm text-purple-600 cursor-help">
              +{systemSettings.pricingTiers.basic}% عن الهدف
            </div>
          </Tooltip>
        </Card>
      </motion.div>

      {/* بطاقات إضافية */}
      <div className="md:col-span-2 lg:col-span-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* إضافة بطاقات إحصائية إضافية هنا */}
        </div>
      </div>
    </div>
  );
}