'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  UsersIcon,
  BriefcaseIcon,
  CalendarIcon
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

const HRHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const quickAccess = [
    { id: 1, title: 'قائمة الموظفين', icon: UsersIcon, count: 45 },
    { id: 2, title: 'الوظائف الشاغرة', icon: BriefcaseIcon, count: 6 },
    { id: 3, title: 'طلبات الإجازة', icon: CalendarIcon, count: 12 }
  ];

  const notifications = [
    { id: 1, text: 'طلب إجازة جديد من محمد علي', urgent: true },
    { id: 2, text: '3 طلبات توظيف جديدة', urgent: false },
    { id: 3, text: 'تذكير: اجتماع تقييم الأداء غدًا', urgent: true }
  ];

  return (
    <motion.header 
      className="fixed w-full z-50 shadow-lg"
      style={{ backgroundColor: COLORS.background }}
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center px-8 py-4">
        {/* الشعار والوصول السريع */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <BriefcaseIcon 
              className="h-8 w-8" 
              style={{ color: COLORS.primary }}
            />
            <h1 
              className="text-xl font-bold"
              style={{ color: COLORS.secondary }}
            >
              إدارة الموارد البشرية
            </h1>
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            {quickAccess.map((item) => (
              <motion.div
                key={item.id}
                className="flex items-center gap-2 cursor-pointer group"
                whileHover={{ scale: 1.05 }}
              >
                <item.icon 
                  className="h-5 w-5" 
                  style={{ color: COLORS.neutral }}
                />
                <span 
                  className="text-sm"
                  style={{ color: COLORS.secondary }}
                >
                  {item.title}
                </span>
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: item.count > 10 ? COLORS.danger + '20' : COLORS.primary + '20',
                    color: item.count > 10 ? COLORS.danger : COLORS.primary
                  }}
                >
                  {item.count}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* الإشعارات وملف المستخدم */}
        <div className="flex items-center gap-6">
          {/* زر الإشعارات */}
          <div className="relative">
            <motion.button
              className="relative p-2 rounded-full hover:bg-gray-100"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
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
              {isNotificationOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl"
                  style={{ border: `1px solid ${COLORS.neutral}30` }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-4 border-b" style={{ borderColor: COLORS.neutral + '30' }}>
                    <h3 className="font-medium" style={{ color: COLORS.secondary }}>
                      الإشعارات ({notifications.filter(n => n.urgent).length})
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className="flex items-start gap-3 p-4 hover:bg-gray-50"
                        style={{ borderBottom: `1px solid ${COLORS.neutral}20` }}
                        whileHover={{ x: 5 }}
                      >
                        {notification.urgent && (
                          <span 
                            className="w-2 h-2 mt-2 rounded-full"
                            style={{ backgroundColor: COLORS.danger }}
                          />
                        )}
                        <p 
                          className={`text-sm ${notification.urgent ? 'font-medium' : ''}`}
                          style={{ color: notification.urgent ? COLORS.secondary : COLORS.neutral }}
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

          {/* ملف المستخدم */}
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
                  علي عبدالرحمن
                </p>
                <p 
                  className="text-sm"
                  style={{ color: COLORS.neutral }}
                >
                  مدير الموارد البشرية
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
                    { name: 'الملف الشخصي', icon: UserCircleIcon },
                    { name: 'الإعدادات', icon: UsersIcon },
                    { name: 'تسجيل الخروج', icon: CalendarIcon }
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

export default HRHeader;