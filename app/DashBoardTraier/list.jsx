"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUser, FiBell, FiSettings, FiMessageSquare, FiCreditCard, FiClock, FiDollarSign, FiGlobe, FiEdit, FiHelpCircle, FiLogOut, FiBriefcase } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
// نظام الألوان الجديد
const colors = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

const List = () => {
    const dispatch = useDispatch();
const handleLogout = () => {
    dispatch(logout());
  };
  // تحسين تأثيرات الحركة
  const menuVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 260, 
        damping: 20,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="w-72 shadow-xl rounded-xl overflow-hidden"
      style={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.gray}30`,
        boxShadow: `0 12px 32px ${colors.black}10`
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={menuVariants}
    >
      {/* رأس الملف الشخصي مع تدرج لوني */}
      <div 
        className="p-6 border-b"
        style={{ borderColor: colors.gray + '30' }}
      >
        <motion.div variants={itemVariants}>
          <h3 
            className="font-bold text-right text-lg mb-1"
            style={{ color: colors.black }}
          >
            محمد نور طبيب
          </h3>
          <p 
            className="text-sm text-right"
            style={{ color: colors.gray }}
          >
            mohammednourteby@g...
          </p>
        </motion.div>
      </div>

      {/* محتوى القائمة مع تحسينات التنسيق */}
      <div className="p-4 space-y-2 text-right">
        {[
          { icon: <FiUser />, text: 'طالب', href: './DashBoardStudent' },
          { icon: <FiBell />, text: 'الإشعارات', href: './Navigation' },
          { icon: <FiSettings />, text: 'إعدادات الحساب', href: './AccountSettings' },
        ].map((item, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Link 
              href={item.href}
              className="flex items-center justify-end gap-3 p-3 rounded-lg hover:bg-opacity-10 transition-all group"
              style={{ 
                color: colors.black,
                hover: { backgroundColor: colors.blue + '10' }
              }}
            >
              <span>{item.text}</span>
              {React.cloneElement(item.icon, {
                className: 'transition-transform',
                style: { color: colors.blue }
              })}
            </Link>
          </motion.div>
        ))}

        <div 
          className="my-4"
          style={{ borderTop: `1px solid ${colors.gray}20` }}
        />

        {/* قسم الرسائل مع إشعار */}
        <motion.div variants={itemVariants}>
          <Link 
            href="./Massage"
            className="flex items-center justify-end gap-3 p-3 rounded-lg hover:bg-opacity-10 group relative"
            style={{ 
              color: colors.black,
              hover: { backgroundColor: colors.blue + '10' }
            }}
          >
            <span>رسائل</span>
            <div className="relative">
              {React.cloneElement(<FiMessageSquare />, {
                className: 'transition-transform',
                style: { color: colors.blue }
              })}
              <span 
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.red }}
              />
            </div>
          </Link>
        </motion.div>

        <div 
          className="my-4"
          style={{ borderTop: `1px solid ${colors.gray}20` }}
        />

        {/* قسم الدفع والاشتراكات */}
        {[
          { icon: <FiCreditCard />, text: 'طرق الدفع', href: './Payment' },
          { icon: <FiClock />, text: 'الاشتراكات', href: '#' },
          { icon: <FiDollarSign />, text: 'رصيد', href: '#' },
          { icon: <FiCreditCard />, text: 'سجل الشراء', href: '#' },
        ].map((item, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Link 
              href={item.href}
              className="flex items-center justify-end gap-3 p-3 rounded-lg hover:bg-opacity-10 group"
              style={{ 
                color: colors.black,
                hover: { backgroundColor: colors.blue + '10' }
              }}
            >
              <span>{item.text}</span>
              {React.cloneElement(item.icon, {
                className: 'transition-transform',
                style: { color: colors.blue }
              })}
            </Link>
          </motion.div>
        ))}

        <div 
          className="my-4"
          style={{ borderTop: `1px solid ${colors.gray}20` }}
        />

        {/* قسم اللغة */}
        <motion.div 
          className="flex justify-between items-center p-3 rounded-lg"
          style={{ backgroundColor: colors.blue + '08' }}
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            {React.cloneElement(<FiGlobe />, {
              style: { color: colors.blue }
            })}
            <span style={{ color: colors.black }}>اللغة</span>
          </div>
          <span style={{ color: colors.blue }}>الإنجليزية</span>
        </motion.div>

        {/* قسم الملف الشخصي */}
        {[
          { icon: <FiUser />, text: 'الملف الشخصي العام', href: './ProfileSettings' },
          { icon: <FiEdit />, text: 'تعديل الملف الشخصي', href: './ProfileSettings' },
        ].map((item, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Link 
              href={item.href}
              className="flex items-center justify-end gap-3 p-3 rounded-lg hover:bg-opacity-10 group"
              style={{ 
                color: colors.black,
                hover: { backgroundColor: colors.blue + '10' }
              }}
            >
              <span>{item.text}</span>
              {React.cloneElement(item.icon, {
                className: 'transition-transform',
                style: { color: colors.blue }
              })}
            </Link>
          </motion.div>
        ))}

        <div 
          className="my-4"
          style={{ borderTop: `1px solid ${colors.gray}20` }}
        />

        {/* قسم المساعدة والخروج */}
        <motion.div variants={itemVariants}>
          <Link 
            href="./Help"
            className="flex items-center justify-end gap-3 p-3 rounded-lg hover:bg-opacity-10 group"
            style={{ 
              color: colors.black,
              hover: { backgroundColor: colors.blue + '10' }
            }}
          >
            <span>المساعدة والدعم</span>
            {React.cloneElement(<FiHelpCircle />, {
              className: 'transition-transform',
              style: { color: colors.blue }
            })}
          </Link>
        </motion.div>

        <motion.button onClick={handleLogout}
          className="w-full flex items-center justify-end gap-3 p-3 rounded-lg hover:bg-opacity-10"
          style={{ 
            color: colors.red,
            hover: { backgroundColor: colors.red + '10' }
          }}
          variants={itemVariants}
        >
          <span>تسجيل الخروج</span>
          {React.cloneElement(<FiLogOut />, {
            style: { color: colors.red }
          })}
        </motion.button>

        {/* قسم الأعمال المميز */}
        <motion.div 
          className="mt-4 p-4 rounded-xl"
          style={{ 
            background: `linear-gradient(135deg, ${colors.blue}, ${colors.yellow})`,
            boxShadow: `0 4px 16px ${colors.blue}20`
          }}
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 text-white">
            {React.cloneElement(<FiBriefcase />, {
              className: 'text-xl'
            })}
            <div>
              <h4 className="font-bold text-lg">الاعتماد العربي للأعمال</h4>
              <p className="text-sm opacity-90 mt-1">جلب التعلم إلى شركتك</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default List;