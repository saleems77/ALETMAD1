"use client"
import React, { useState } from 'react';
import { 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaCalendarAlt,
  FaSearch,
  FaChevronDown,
  FaPlus
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const MetaSocialPlanner = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const metaPlatforms = [
    { 
      name: 'Facebook', 
      icon: <FaFacebook className="text-[#1877F2] text-2xl" />, 
      plannerUrl: 'https://business.facebook.com/creatorstudio?content_table=POSTS',
      category: 'social'
    },
    { 
      name: 'Instagram', 
      icon: <FaInstagram className="text-gradient-instagram text-2xl" />, 
      plannerUrl: 'https://business.facebook.com/creatorstudio?content_table=POSTS',
      category: 'social'
    },
    { 
      name: 'WhatsApp Business', 
      icon: <FaWhatsapp className="text-[#25D366] text-2xl" />, 
      plannerUrl: 'https://business.whatsapp.com/',
      category: 'business'
    },
    { 
      name: 'Facebook Messenger', 
      icon: <FaFacebook className="text-[#0084FF] text-2xl" />, 
      plannerUrl: 'https://business.facebook.com/creatorstudio?content_table=POSTS',
      category: 'social'
    },
    { 
      name: 'Threads', 
      icon: <FaTwitter className="text-[#000000] text-2xl" />, 
      plannerUrl: 'https://business.facebook.com/creatorstudio?content_table=POSTS',
      category: 'social'
    }
  ];

  const statsData = [
    { label: 'منشورات مجدولة', value: 24, change: '+12%', color: 'text-[#008DCB]' },
    { label: 'تفاعل متوقع', value: 3200, change: '+8%', color: 'text-[#F9D011]' },
    { label: 'حسابات متصلة', value: 5, change: '+2', color: 'text-[#E2101E]' }
  ];

  const filteredPlatforms = metaPlatforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || platform.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#008DCB] bg-opacity-10 w-16 h-16 rounded-xl flex items-center justify-center">
              <FaCalendarAlt className="text-[#008DCB] text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0D1012]">
                مخطط منشورات وسائل التواصل الاجتماعي
              </h1>
              <p className="mt-1 text-lg text-[#999999]">
                جدولة المحتوى على منصات Meta من مكان واحد
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن منصة..."
                className="pl-10 pr-4 py-2.5 rounded-xl border border-[#999999] border-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#008DCB] focus:ring-opacity-30 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3.5 text-[#999999]" />
            </div>
            
            <div className="flex gap-2">
              <button 
                className={`px-4 py-2.5 rounded-xl border transition-all ${
                  activeFilter === 'all' 
                    ? 'bg-[#008DCB] bg-opacity-10 border-[#008DCB] text-[#008DCB]' 
                    : 'border-[#999999] border-opacity-30 text-[#999999]'
                }`}
                onClick={() => setActiveFilter('all')}
              >
                الكل
              </button>
              <button 
                className={`px-4 py-2.5 rounded-xl border transition-all ${
                  activeFilter === 'social' 
                    ? 'bg-[#008DCB] bg-opacity-10 border-[#008DCB] text-[#008DCB]' 
                    : 'border-[#999999] border-opacity-30 text-[#999999]'
                }`}
                onClick={() => setActiveFilter('social')}
              >
                اجتماعية
              </button>
              <button 
                className={`px-4 py-2.5 rounded-xl border transition-all ${
                  activeFilter === 'business' 
                    ? 'bg-[#008DCB] bg-opacity-10 border-[#008DCB] text-[#008DCB]' 
                    : 'border-[#999999] border-opacity-30 text-[#999999]'
                }`}
                onClick={() => setActiveFilter('business')}
              >
                أعمال
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {statsData.map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-2xl shadow-custom p-6 border border-[#999999] border-opacity-20"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-[#999999] font-medium">{stat.label}</h3>
                <div className={`text-sm font-semibold ${stat.color}`}>{stat.change}</div>
              </div>
              <p className="text-3xl font-bold text-[#0D1012] mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Platforms Section */}
        <div className="bg-white rounded-2xl shadow-custom overflow-hidden">
          <div className="p-6 border-b border-[#999999] border-opacity-20">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#0D1012]">
                منصات Meta المتاحة
              </h2>
              <button className="flex items-center gap-2 text-[#008DCB] font-medium">
                <FaPlus className="text-xs" />
                إضافة حساب جديد
              </button>
            </div>
            <p className="mt-2 text-[#999999]">
              اختر منصة للانتقال إلى أداة الجدولة الخاصة بها
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
            {filteredPlatforms.map((platform, index) => (
              <motion.a
                key={index}
                href={platform.plannerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="bg-white rounded-xl border border-[#999999] border-opacity-20 p-6 transition-all duration-300 group-hover:border-[#008DCB] group-hover:shadow-platform">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#008DCB] bg-opacity-10 w-12 h-12 rounded-xl flex items-center justify-center">
                        {platform.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-[#0D1012]">{platform.name}</h3>
                    </div>
                    <div className="text-[#999999] group-hover:text-[#008DCB] transition-colors">
                      <FaChevronDown className="transform -rotate-90" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-[#999999]">جدولة المنشورات</span>
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F9D011]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#E2101E]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#008DCB]"></div>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          
          <div className="bg-[#F8F9FA] px-6 py-4 border-t border-[#999999] border-opacity-20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[#999999]">
                يتطلب الوصول الكامل إلى أدوات الجدولة حساب Meta Business Suite نشط
              </p>
              <button 
                className="bg-[#008DCB] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#0075ad] transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'إخفاء التفاصيل' : 'عرض المزيد'}
              </button>
            </div>
            
            {isExpanded && (
              <motion.div 
                className="mt-4 pt-4 border-t border-[#999999] border-opacity-20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-medium text-[#0D1012] mb-2">كيفية الربح مع Meta Business Suite</h3>
                <ul className="text-sm text-[#999999] space-y-2 list-disc pl-5">
                  <li>إنشاء محتوى متسق وجذاب للمتابعين</li>
                  <li>استخدام التحليلات لفهم جمهورك بشكل أفضل</li>
                  <li>الاستفادة من الإعلانات المستهدفة لزيادة الوصول</li>
                  <li>جدولة المحتوى في الأوقات المثلى للتفاعل</li>
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-10 bg-white rounded-2xl shadow-custom p-6">
          <h2 className="text-xl font-bold text-[#0D1012] mb-4">النشاط الحديث</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start gap-4 pb-4 border-b border-[#999999] border-opacity-20 last:border-0 last:pb-0">
                <div className="mt-1">
                  <div className="w-3 h-3 rounded-full bg-[#008DCB]"></div>
                </div>
                <div>
                  <h3 className="font-medium text-[#0D1012]">تمت جدولة منشور جديد</h3>
                  <p className="text-sm text-[#999999] mt-1">منشور على Instagram مبرمج ليوم 15 يوليو في الساعة 2:30 مساءً</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-[#008DCB] bg-opacity-10 text-[#008DCB] rounded">معلّق</span>
                    <span className="text-xs px-2 py-1 bg-[#F9D011] bg-opacity-10 text-[#F9D011] rounded">في الانتظار</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .text-gradient-instagram {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .shadow-custom {
          box-shadow: 0 4px 20px rgba(13, 16, 18, 0.05);
        }
        
        .shadow-platform {
          box-shadow: 0 10px 25px rgba(0, 141, 203, 0.15);
        }
      `}</style>
    </div>
  );
};

export default MetaSocialPlanner;