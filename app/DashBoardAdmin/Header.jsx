'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChartPieIcon,
  DocumentChartBarIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon
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

const BoardHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  
  // مؤشرات الأداء
  const performanceMetrics = [
    { id: 1, title: 'معدل النمو', value: '18%', change: +2.4 },
    { id: 2, title: 'الأرباح', value: '2.1M ر.س', change: -0.8 },
    { id: 3, title: 'الاستثمارات', value: '4.3M ر.س', change: +5.1 }
  ];

  // الإشعارات
  const notifications = [
    { id: 1, text: 'اجتماع مجلس الإدارة الطارئ', urgent: true },
    { id: 2, text: 'اعتماد الميزانية السنوية', urgent: false },
    { id: 3, text: 'مراجعة سياسة الاستثمار', urgent: true }
  ];

  return (
    <motion.header 
      className="fixed w-full z-50 shadow-xl"
      style={{ backgroundColor: COLORS.background }}
      initial={{ y: -20 }}
      animate={{ y: 0 }}
    >
      <div className="flex justify-between items-center px-8 py-1">
        {/* الجانب الأيسر مع المؤشرات */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <img 
              src="/board-logo.png" 
              alt="Board Logo" 
              className="h-12 w-12"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              مجلس الإدارة التنفيذي
            </h1>
          </div>
          
          {/* مؤشرات الأداء */}
          <div className="hidden xl:flex items-center gap-6">
            {performanceMetrics.map((metric) => (
              <motion.div
                key={metric.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-2 rounded-full" style={{ 
                  backgroundColor: metric.change > 0 ? `${COLORS.primary}20` : `${COLORS.danger}20`,
                  color: metric.change > 0 ? COLORS.primary : COLORS.danger
                }}>
                  <ArrowTrendingUpIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: COLORS.neutral }}>{metric.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="font-bold" style={{ color: COLORS.secondary }}>{metric.value}</p>
                    <span className={`text-sm ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ({metric.change > 0 ? '+' : ''}{metric.change}%)
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* الجانب الأيمن مع أدوات التحكم */}
        <div className="flex items-center gap-6">
          {/* الإشعارات */}
          <div className="relative">
            <motion.button
              className="relative p-2 rounded-full"
              whileTap={{ scale: 0.95 }}
            >
              <BellIcon 
                className="h-7 w-7" 
                style={{ color: COLORS.secondary }}
              />
              <span 
                className="absolute top-0 right-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS.danger }}
              />
            </motion.button>

            <AnimatePresence>
              {isReportsOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl"
                  style={{ border: `1px solid ${COLORS.neutral}30` }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-4 border-b" style={{ borderColor: COLORS.neutral + '30' }}>
                    <h3 className="font-bold" style={{ color: COLORS.secondary }}>
                      الإشعارات المهمة
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className="flex items-start gap-3 p-4 hover:bg-gray-50"
                        style={{ borderBottom: `1px solid ${COLORS.neutral}10` }}
                        whileHover={{ x: 5 }}
                      >
                        {notification.urgent && (
                          <span 
                            className="w-2 h-2 mt-2 rounded-full"
                            style={{ backgroundColor: COLORS.accent }}
                          />
                        )}
                        <p 
                          className={`text-sm ${notification.urgent ? 'font-bold' : ''}`}
                          style={{ color: COLORS.secondary }}
                        >
                          {notification.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ملف العضو */}
          <div className="relative">
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <img 
                  src="/board-member.png" 
                  alt="Member" 
                  className="h-12 w-12 rounded-full border-2"
                  style={{ borderColor: COLORS.primary }}
                />
                <div 
                  className="absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white"
                  style={{ backgroundColor: COLORS.accent }}
                />
              </div>
              <div className="text-right">
                <p 
                  className="font-bold"
                  style={{ color: COLORS.secondary }}
                >
                  د. عبدالله السديري
                </p>
                <p 
                  className="text-sm"
                  style={{ color: COLORS.neutral }}
                >
                  رئيس مجلس الإدارة
                </p>
              </div>
              <ChevronDownIcon 
                className={`h-6 w-6 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                style={{ color: COLORS.secondary }}
              />
            </motion.div>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl"
                  style={{ 
                    border: `1px solid ${COLORS.neutral}30`,
                    backgroundColor: COLORS.background
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {[
                    { name: 'الملف التنفيذي', icon: UserCircleIcon },
                    { name: 'التقارير الاستراتيجية', icon: DocumentChartBarIcon },
                    { name: 'تسجيل الخروج', icon: ChevronDownIcon }
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
                        className="text-sm font-medium"
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

      {/* شريط الحالة اللوني */}
      <div className="h-1.5 w-full flex">
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

export default BoardHeader;