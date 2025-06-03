'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon,
  UserCircleIcon,
  ChartBarIcon,
  ChevronDownIcon,
  MegaphoneIcon,
  CurrencyDollarIcon,
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

const MarketingDashboardHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCampaignMenuOpen, setIsCampaignMenuOpen] = useState(false);
  
  const marketingMetrics = [
    { id: 1, title: 'معدل التحويل', value: '24%', change: +3.2 },
    { id: 2, title: 'الإنفاق اليومي', value: '8,450 ر.س', change: -1.5 },
    { id: 3, title: 'الوصول', value: '1.2M', change: +12.7 }
  ];

  const campaigns = [
    { id: 1, name: 'العودة للمدارس', status: 'نشطة', budget: '25,000 ر.س' },
    { id: 2, name: 'المنح الدراسية', status: 'متوقفة', budget: '15,000 ر.س' }
  ];

  return (
    <motion.header 
      className="fixed w-full z-50 shadow-2xl"
      style={{ backgroundColor: COLORS.background }}
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center px-8 py-2">
        {/* الجانب الأيسر مع المؤشرات */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <MegaphoneIcon 
              className="h-9 w-9 transform rotate-12"
              style={{ color: COLORS.primary }}
            />
            <h1 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            >
              لوحة التحكم التسويقية
            </h1>
          </div>
          
          <div className="hidden xl:flex items-center gap-6">
            {marketingMetrics.map((metric) => (
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
          {/* قائمة الحملات */}
          <div className="relative">
            <motion.button
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100"
              onClick={() => setIsCampaignMenuOpen(!isCampaignMenuOpen)}
              whileHover={{ scale: 1.02 }}
            >
              <CurrencyDollarIcon 
                className="h-6 w-6" 
                style={{ color: COLORS.primary }}
              />
              <span className="font-medium" style={{ color: COLORS.secondary }}>الحملات</span>
              <ChevronDownIcon 
                className={`h-4 w-4 transition-transform ${isCampaignMenuOpen ? 'rotate-180' : ''}`}
                style={{ color: COLORS.neutral }}
              />
            </motion.button>

            <AnimatePresence>
              {isCampaignMenuOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl"
                  style={{ 
                    border: `1px solid ${COLORS.neutral}30`,
                    backgroundColor: COLORS.background
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-4 border-b" style={{ borderColor: COLORS.neutral + '30' }}>
                    <h3 className="font-medium" style={{ color: COLORS.secondary }}>إدارة الحملات</h3>
                  </div>
                  <div className="p-2">
                    {campaigns.map((campaign) => (
                      <motion.div
                        key={campaign.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                        whileHover={{ x: 5 }}
                      >
                        <div>
                          <p className="font-medium" style={{ color: COLORS.secondary }}>{campaign.name}</p>
                          <p className="text-sm" style={{ color: COLORS.neutral }}>{campaign.budget}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          campaign.status === 'نشطة' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* إشعارات وملف المستخدم */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <BellIcon className="h-6 w-6" style={{ color: COLORS.secondary }} />
              <span 
                className="absolute top-0 right-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS.danger }}
              />
            </button>

            <div className="relative">
              <motion.div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileHover={{ scale: 1.02 }}
              >
                <UserCircleIcon 
                  className="h-10 w-10" 
                  style={{ color: COLORS.primary }}
                />
                <div className="text-right">
                  <p className="font-medium" style={{ color: COLORS.secondary }}>سارة عبدالله</p>
                  <p className="text-sm" style={{ color: COLORS.neutral }}>مديرة تسويق رقمي</p>
                </div>
              </motion.div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl"
                    style={{ 
                      border: `1px solid ${COLORS.neutral}30`,
                      backgroundColor: COLORS.background
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {[
                      { name: 'الملف الشخصي', icon: UserCircleIcon },
                      { name: 'تحليل الأداء', icon: ChartBarIcon },
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

export default MarketingDashboardHeader;