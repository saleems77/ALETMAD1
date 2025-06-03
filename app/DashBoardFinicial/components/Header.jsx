'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const COLORS = {
  primary: '#008DCB',    // أزرق 10%
  secondary: '#0D1012',  // أسود 5%
  neutral: '#999999',    // رمادي 20%
  danger: '#E2101E',     // أحمر 7%
  background: '#FFFFFF', // أبيض 50%
  accent: '#F9D011'      // أصفر 8%
};

const FinanceHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  const financialAlerts = [
    { id: 1, title: 'دفعة متأخرة من العميل X', amount: '45,000 ر.س', urgent: true },
    { id: 2, title: 'استحقاق فاتورة كهرباء', amount: '8,200 ر.س', urgent: false },
    { id: 3, title: 'تجاوز ميزانية التسويق', amount: '12,500 ر.س', urgent: true }
  ];

  const quickActions = [
    { id: 1, title: 'إنشاء فاتورة', icon: DocumentChartBarIcon },
    { id: 2, title: 'سجل المعاملات', icon: BanknotesIcon },
    { id: 3, title: 'التقارير الشهرية', icon: CurrencyDollarIcon }
  ];

  return (
    <motion.header 
      className="fixed w-full z-50 shadow-xl"
      style={{ backgroundColor: COLORS.background }}
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center px-8 py-4">
        {/* الجزء الأيسر */}
        <div className="flex items-center gap-6">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <CurrencyDollarIcon 
              className="h-8 w-8" 
              style={{ color: COLORS.primary }}
            />
            <h1 
              className="text-xl font-bold"
              style={{ color: COLORS.secondary }}
            >
              الإدارة المالية
            </h1>
          </motion.div>

          {/* إجراءات سريعة */}
          <div className="hidden lg:flex items-center gap-4">
            {quickActions.map((action) => (
              <motion.button
                key={action.id}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                style={{ color: COLORS.secondary }}
                whileHover={{ x: 5 }}
              >
                <action.icon className="h-5 w-5" style={{ color: COLORS.primary }} />
                <span className="text-sm">{action.title}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* الجزء الأيمن */}
        <div className="flex items-center gap-6">
          {/* تنبيهات مالية */}
          <div className="relative">
            <motion.button
              className="relative p-2 rounded-full hover:bg-gray-100"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAlertOpen(!isAlertOpen)}
            >
              <BellIcon 
                className="h-6 w-6" 
                style={{ color: COLORS.secondary }}
              />
              <span 
                className="absolute top-0 right-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS.danger }}
              />
            </motion.button>

            <AnimatePresence>
              {isAlertOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl"
                  style={{ border: `1px solid ${COLORS.neutral}30` }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-4 border-b" style={{ borderColor: COLORS.neutral + '30' }}>
                    <h3 className="font-medium" style={{ color: COLORS.secondary }}>
                      التنبيهات المالية ({financialAlerts.filter(a => a.urgent).length})
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {financialAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        className="flex justify-between items-start p-4 hover:bg-gray-50"
                        style={{ borderBottom: `1px solid ${COLORS.neutral}20` }}
                        whileHover={{ x: 5 }}
                      >
                        <div>
                          <p 
                            className={`text-sm ${alert.urgent ? 'font-medium' : ''}`}
                            style={{ color: alert.urgent ? COLORS.danger : COLORS.secondary }}
                          >
                            {alert.title}
                          </p>
                          <p 
                            className="text-xs mt-1"
                            style={{ color: COLORS.neutral }}
                          >
                            {alert.amount}
                          </p>
                        </div>
                        {alert.urgent && (
                          <span 
                            className="w-2 h-2 mt-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: COLORS.danger }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ملف المحاسب */}
          <div className="relative">
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <UserCircleIcon 
                  className="h-10 w-10" 
                  style={{ color: COLORS.primary }}
                />
                <div 
                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: COLORS.accent }}
                />
              </div>
              <div className="text-right">
                <p 
                  className="font-medium"
                  style={{ color: COLORS.secondary }}
                >
                  خالد سعيد
                </p>
                <p 
                  className="text-sm"
                  style={{ color: COLORS.neutral }}
                >
                  محاسب معتمد
                </p>
              </div>
              <ChevronDownIcon 
                className={`h-5 w-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                style={{ color: COLORS.neutral }}
              />
            </motion.div>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl"
                  style={{ border: `1px solid ${COLORS.neutral}30` }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {[
                    { name: 'الملف المالي', icon: CurrencyDollarIcon },
                    { name: 'الإعدادات', icon: DocumentChartBarIcon },
                    { name: 'تسجيل الخروج', icon: BanknotesIcon }
                  ].map((item, index) => (
                    <motion.div
                      key={item.name}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50"
                      style={{ borderBottom: index !== 2 ? `1px solid ${COLORS.neutral}20` : 'none' }}
                      whileHover={{ x: 5 }}
                    >
                      <item.icon 
                        className="h-5 w-5" 
                        style={{ color: COLORS.primary }}
                      />
                      <span 
                        className="text-sm"
                        style={{ color: COLORS.secondary }}
                      >
                        {item.name}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* مؤشر الحالة المالية */}
      <div className="h-1.5 w-full flex bg-gradient-to-r">
        <div style={{ width: '10%', backgroundColor: COLORS.primary }} />
        <div style={{ width: '5%', backgroundColor: COLORS.secondary }} />
        <div style={{ width: '20%', backgroundColor: COLORS.neutral }} />
        <div style={{ width: '7%', backgroundColor: COLORS.danger }} />
        <div style={{ width: '8%', backgroundColor: COLORS.accent }} />
        <div style={{ width: '50%', backgroundColor: COLORS.background }} />
      </div>
    </motion.header>
  );
};

export default FinanceHeader;