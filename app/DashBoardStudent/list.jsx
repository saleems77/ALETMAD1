"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiBell, FiMessageSquare, FiSettings, 
         FiCreditCard, FiClock, FiDollarSign, FiGlobe, FiUser, 
         FiEdit, FiHelpCircle, FiLogOut, FiBriefcase } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';

const List = () => {
  const { language, t } = useLanguage();
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 0.2]);

  const menuVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 25 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="relative w-80 h-[75vh] flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* ظلال التمرير الديناميكية */}
      <motion.div
        style={{ opacity: shadowOpacity }}
        className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-purple-50 to-transparent z-20 pointer-events-none"
      />
      
      {/* المحتوى الرئيسي */}
      <div
        ref={scrollRef}
        className="flex-1 bg-gradient-to-br from-purple-50 via-white to-purple-50 shadow-2xl rounded-3xl p-6 border-2 border-purple-100/50 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200/70 scrollbar-track-transparent"
      >
        {/* رأس ثابت أثناء التمرير */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={menuVariants}
          className="pb-6 border-b border-purple-200/50 mb-6 group sticky top-0 bg-gradient-to-b from-purple-50/95 via-purple-50/90 to-transparent backdrop-blur-lg z-10"
        >
          <div className={`flex items-center gap-4 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">م</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className={`text-${language === 'ar' ? 'right' : 'left'}`}>
              <h3 className="font-bold text-2xl bg-gradient-to-r from-purple-900 to-blue-700 bg-clip-text text-transparent">
                {t?.profile?.title}
              </h3>
              <p className="text-purple-600/80 text-sm mt-1">mohammednourteby@g...</p>
            </div>
          </div>
        </motion.div>

        {/* محتوى القائمة */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={menuVariants}
          className="space-y-6 pb-6"
        >
          {/* القسم التعليمي */}
          <motion.div variants={itemVariants}>
            <Link href="./Courses" className={`flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-purple-50/50 group ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span className="text-purple-900 font-medium">{t?.menu?.education}</span>
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                <FiShoppingCart className="text-2xl text-purple-600" />
              </div>
            </Link>
          </motion.div>

          {/* عناصر القائمة */}
          {[
            { href: "#", text: t?.menu?.cart, icon: <FiShoppingCart /> },
            { href: "./FavoritesPage", text: t?.menu?.wishlist, icon: <FiHeart />, badge: 2 },
            { href: "./DashBoardTraier", text: t?.menu?.trainer_dashboard, icon: <FiBriefcase /> },
          ].map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link href={item.href} className={`flex items-center gap-4 p-3 rounded-xl hover:bg-purple-50/50 transition-all group ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1 text-purple-800">{item.text}</div>
                <div className="relative">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                    {React.cloneElement(item.icon, { className: "text-2xl text-purple-600" })}
                  </div>
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-xs text-white rounded-full flex items-center justify-center shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}

          {/* فاصل الإشعارات */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-200/40"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-r from-purple-50 via-white to-purple-50 text-sm text-purple-500">
                {t?.sections?.notifications}
              </span>
            </div>
          </div>

          {/* الإشعارات والرسائل */}
          {[
            { href: "./Navigation", text: t?.menu?.notifications, icon: <FiBell />, notification: true },
            { href: "./Massage", text: t?.menu?.messages, icon: <FiMessageSquare /> },
          ].map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link href={item.href} className={`flex items-center gap-4 p-3 rounded-xl hover:bg-purple-50/50 transition-all ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span className="text-purple-800">{item.text}</span>
                <div className="relative">
                  {React.cloneElement(item.icon, { className: "text-2xl text-purple-600" })}
                  {item.notification && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}

          {/* قسم الإعدادات */}
          <motion.div variants={itemVariants} className="mt-6 p-4 rounded-xl bg-purple-50/30 border border-purple-100/50">
            {[
              { href: "./AccountSettings", text: t?.settings?.account, icon: <FiSettings /> },
              { href: "./Payment", text: t?.settings?.payment_methods, icon: <FiCreditCard /> },
              { href: "./Subscription", text: t?.settings?.subscriptions, icon: <FiClock /> },
              { href: "#", text: t?.settings?.balance, icon: <FiDollarSign /> },
              { href: "#", text: t?.settings?.purchase_history, icon: <FiCreditCard /> },
            ].map((item, index) => (
              <Link key={index} href={item.href} className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white transition-all ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span className="text-purple-800">{item.text}</span>
                {React.cloneElement(item.icon, { className: "text-xl text-purple-600" })}
              </Link>
            ))}
          </motion.div>

          {/* إعدادات اللغة */}
          <motion.div variants={itemVariants} className="mt-6">
            <div className={`flex justify-between items-center p-3 rounded-xl bg-purple-50/50 hover:bg-purple-100/30 transition-all cursor-pointer ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-3">
                <FiGlobe className="text-xl text-purple-600" />
                <span className="text-purple-800">{t?.settings?.language}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm">
                <span className="text-purple-700">
                  {language === 'ar' ? t?.language?.arabic : t?.language?.english}
                </span>
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              </div>
            </div>
          </motion.div>

          {/* الملف الشخصي */}
          {[
            { href: "./ProfileSettings", text: t?.profile?.public_profile, icon: <FiUser /> },
            { href: "./ProfileSettings", text: t?.profile?.edit_profile, icon: <FiEdit /> },
          ].map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link href={item.href} className={`flex items-center gap-4 p-3 rounded-xl hover:bg-purple-50/50 transition-all ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span className="text-purple-800">{item.text}</span>
                {React.cloneElement(item.icon, { className: "text-xl text-purple-600" })}
              </Link>
            </motion.div>
          ))}

          {/* الدعم وتسجيل الخروج */}
          <motion.div variants={itemVariants} className="mt-6 space-y-4">
            <Link href="./Help" className={`flex items-center gap-4 p-3 rounded-xl bg-red-50/50 hover:bg-red-100/30 transition-all ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span className="text-red-700">{t?.menu?.help_support}</span>
              <FiHelpCircle className="text-xl text-red-600" />
            </Link>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-4 p-3 rounded-xl bg-red-100/50 hover:bg-red-200/30 transition-all ${language === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              <span className="text-red-700 font-medium">{t?.menu?.logout}</span>
              <FiLogOut className="text-xl text-red-600" />
            </motion.button>
          </motion.div>

          {/* قسم الأعمال */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 p-5 rounded-xl bg-gradient-to-br from-purple-700 to-blue-600 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <FiBriefcase className="text-3xl text-white/90" />
              </div>
              <div>
                <h4 className="font-bold text-xl text-white">{t?.business?.title}</h4>
                <p className="text-sm text-white/80 mt-1">{t?.business?.subtitle}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-4 w-full py-2 bg-white/10 text-white rounded-lg backdrop-blur-sm"
            >
              {t?.buttons?.discover_more}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* مؤشر التمرير المخصص */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 h-40 w-1.5 bg-purple-100/50 rounded-full overflow-hidden">
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="w-full h-full bg-purple-400 origin-top"
        />
      </div>

      {/* ظال سفلي ثابت */}
      <motion.div
        style={{ opacity: shadowOpacity }}
        className="sticky bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-purple-50 to-transparent z-20 pointer-events-none"
      />
    </div>
  );
};

export default List;