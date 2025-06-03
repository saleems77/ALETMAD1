"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FiBookOpen,
  FiMessageCircle,
  FiSettings,
  FiUsers,
  FiFolder,
  FiBarChart2,
  FiGift,
  FiBell,  FiShare2,        // لوسائل التواصل
  FiDollarSign,    // للمالية
  FiAward,         // للشهادا 
} from "react-icons/fi";

const COLORS = {
  blue: '#008DCB',
  white: '#FFFFFF'
};

export default function FixedSidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  const menuItems = [
    {
      name: "الدورات التدريبية",
      icon: <FiBookOpen size={22} />,
      link: "/DashBoardTraier/Courses"
    },
    {
      name: "المراسلات",
      icon: <FiMessageCircle size={22} />,
      link: "./Massage"
    },
    {
      name: "متابعة الدورات و اضافة اختبارات",
      icon: <FiSettings size={22} />,
      link: "/AddTest"
    },
    {
      name: "المجموعات",
      icon: <FiUsers size={22} />,
      link: "/DashBoardTraier/components/groups"
    },
    {
      name: "الموارد العلمية",
      icon: <FiFolder size={22} />,
      link: "./Materials"
    },
    
    {
      name: "التقييم الذاتي",
      icon: <FiBarChart2 size={22} />,
      link: "/DashBoardTraier/components/Self-Assessment"
    },
    {
      name: "كوبونات الدعوة",
      icon: <FiGift size={22} />,
      link: "/DashBoardTraier/components/copon"
    },
    {
      name: "Ads",
      icon: <FiBell size={22} />,
      link: "./ads"
    },
    {
      name: "Social Media",
      icon: <FiShare2 size={22} />,
      link: "./Social"
    },
    {
      name: "المالية",
      icon: <FiDollarSign size={22} />,
      link: "/DashBoardTraier/components/Finance"
    },
    {
      name: "الشهادات",
      icon: <FiAward size={22} />,
      link: "/DashBoardTraier/components/Certificate"
    },
    {
      name: "فريق تسويقي",
      icon: <FiUsers size={22} />,
      link: "/DashBoardTraier/components/Marketer"
    },
  ];

  const sidebarVariants = {
    collapsed: { width: 80 },
    expanded: { width: 280 }
  };

  return (
    <motion.div
      initial="collapsed"
      animate={isHovered ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: COLORS.blue,
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 1000
      }}
      className="shadow-xl border-r border-blue-800"
    >
      {/* الشعار المعدل */}
      <div className="p-4 border-b border-blue-800 h-20 flex items-center justify-center">
        <AnimatePresence>
          {isHovered ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Image
                src="/الاعتماد العربي.png"
                alt="شعار الاعتماد العربي"
                width={160}
                height={40}
                className="filter brightness-0 invert"
              />
            </motion.div>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-white"
            >
              اع
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* عناصر القائمة */}
      <nav className="flex-1 p-3 space-y-2 mt-4 overflow-y-auto h-[calc(100vh-160px)]">
        {menuItems.map((item, index) => (
          <motion.a
            key={index}
            href={item.link}
            className="relative flex items-center p-3 rounded-lg group"
            style={{
              backgroundColor: activeItem === index ? '#0077B5' : 'transparent',
            }}
            onClick={() => setActiveItem(index)}
          >
            <span className="shrink-0 text-white">
              {item.icon}
            </span>

            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="pr-3 text-sm font-bold flex-1 text-white"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>

            {activeItem === index && (
              <motion.div 
                className="absolute -right-2 w-1 h-6 rounded-full bg-white"
                layoutId="activeIndicator"
              />
            )}

            {!isHovered && (
              <motion.div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 rounded-md shadow-lg"
                style={{ 
                  backgroundColor: COLORS.blue,
                  border: '1px solid #0077B5'
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="text-xs font-bold text-white">{item.name}</span>
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-blue-800"/>
              </motion.div>
            )}
          </motion.a>
        ))}
      </nav>

      
    </motion.div>
  );
}