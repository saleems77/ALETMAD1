// src/components/Header.jsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiUser, FiMessageCircle } from 'react-icons/fi';
import List from './list';
import Link from 'next/link';

// ألوان التصميم الرئيسية
const colors = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011',
};

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasNotifications] = useState(true);
  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);

  // تأثيرات الحركة المحسنة
  const menuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isProfileOpen &&
        profileRef.current &&
        profileButtonRef.current &&
        !profileRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 rtl:space-x-reverse">
          {/* Left-side actions */}
          <div className="flex items-center gap-4">
            <Link href="/ChatAI" className="hidden md:block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-lg transition-all"
                style={{ backgroundColor: colors.white, border: `1px solid ${colors.gray}` }}
              >
                <FiMessageCircle size={26} style={{ color: colors.blue }} />
                <span
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.yellow }}
                />
              </motion.div>
            </Link>
            <Link href="/Navigation">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-lg transition-all"
                style={{ backgroundColor: colors.white, border: `1px solid ${colors.gray}` }}
              >
                <FiBell size={26} style={{ color: colors.blue }} />
                {hasNotifications && (
                  <span
                    className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ backgroundColor: colors.red }}
                  />
                )}
              </motion.button>
            </Link>
            <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="relative p-2 rounded-lg transition-all"
  style={{ backgroundColor: colors.white, border: `1px solid ${colors.gray}` }}
  onClick={() => setIsProfileOpen(!isProfileOpen)}
  ref={profileButtonRef}
>
  <FiUser size={26} style={{ color: colors.blue }} />
  {hasNotifications && (
    <span
      className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full animate-pulse"
      style={{ backgroundColor: colors.red }}
    />
  )}
</motion.button>
          </div>

          {/* Authentication buttons */}
          
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    ref={profileRef}
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full right-0 mt-2 w-48 origin-top-right rounded-2xl bg-white p-2 shadow-lg"
                    style={{ border: `1px solid ${colors.gray}` }}
                  >
                    <List colors={colors} onClose={() => setIsProfileOpen(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
              <Link 
  href="/login"
  className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-900 bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
>
  <span className="ml-2"> أنشئ حساب \ سجل الدخول</span>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5 mr-2 rotate-180" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path 
      fillRule="evenodd" 
      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
      clipRule="evenodd" 
    />
  </svg>
</Link>
        </div>
        
  
      </div>
    </header>
  );
}
