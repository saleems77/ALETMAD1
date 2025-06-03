"use client";
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiPlus, FiPlayCircle, FiVideo, FiUsers, FiArrowRight, FiBarChart2, FiAward, FiClock } from 'react-icons/fi';
import Link from 'next/link';

// تعريف الألوان الجديدة
const colors = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

const HomePage = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.1]);

  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: { 
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-20 pt-10">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden rounded-[2.5rem] shadow-xl"
        >
          <motion.div 
            style={{ 
              scale,
              background: `linear-gradient(135deg, ${colors.blue} 0%, #006A9E 100%)`
            }}
            className="absolute inset-0"
          />
          
          <div className="relative z-10 p-16 text-white">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <span 
                  className="text-sm px-4 py-1.5 rounded-full inline-flex items-center gap-2"
                  style={{ 
                    backgroundColor: colors.white + '15',
                    border: `1px solid ${colors.white}20`
                  }}>
                  <span className="text-yellow-400">🚀</span>
                  الإصدار الاحترافي الجديد
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl font-bold leading-tight mb-6"
              >
                اصنع تجربة تعليمية
                <br />
                <span style={{ color: colors.yellow }}>
                  لا تُنسى
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg leading-relaxed mb-10 opacity-90"
              >
                منصة متكاملة لبناء دورات تفاعلية بمعايير عالمية، مزودة بأدوات تحليلية ذكية 
                ونظام تقييم متقدم لضمان نجاحك التعليمي.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-6 items-center"
              >
                <Link
                  href="./AddCourse"
                  className="px-8 py-4 rounded-xl font-semibold
                           flex items-center gap-3 transition-all
                           shadow-lg hover:shadow-xl active:scale-95"
                  style={{
                    backgroundColor: colors.white,
                    color: colors.blue,
                    boxShadow: `0 6px 20px ${colors.blue}30`
                  }}
                >
                  <FiPlus className="text-2xl" />
                  بدء دورة جديدة
                </Link>
                
                <button 
                  className="flex items-center gap-3 px-8 py-4 rounded-xl
                            backdrop-blur-sm transition-colors"
                  style={{
                    border: `2px solid ${colors.white}40`,
                    color: colors.white
                  }}>
                  <FiPlayCircle className="text-2xl" />
                  مشاهدة العرض التوضيحي
                </button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        >
          {[
            { 
              icon: <FiVideo style={{ color: colors.blue }} />, 
              value: "4K+", 
              label: "دورة مكتملة",
              bg: colors.blue + '15'
            },
            { 
              icon: <FiUsers style={{ color: colors.red }} />, 
              value: "50K+", 
              label: "متدرب نشط",
              bg: colors.red + '15'
            },
            { 
              icon: <FiBarChart2 style={{ color: colors.yellow }} />, 
              value: "98%", 
              label: "رضاء العملاء",
              bg: colors.yellow + '15'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="p-8 rounded-2xl backdrop-blur-sm border border-gray-100"
              style={{ backgroundColor: stat.bg }}
            >
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-xl bg-white shadow-sm">
                  {React.cloneElement(stat.icon, { className: "text-3xl" })}
                </div>
                <div>
                  <div 
                    className="text-3xl font-bold mb-1" 
                    style={{ color: colors.black }}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <section className="space-y-16">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center"
            style={{ color: colors.black }}
          >
            مميزاتنا الاستثنائية
          </motion.h3>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiVideo className="text-4xl" style={{ color: colors.white }} />,
                title: "استوديو افتراضي",
                content: "مزود بشاشة خضراء افتراضية، معاينة مباشرة، ومكتبة مؤثرات بصرية",
                gradient: `linear-gradient(135deg, ${colors.blue} 0%, #006A9E 100%)`
              },
              {
                icon: <FiPlayCircle className="text-4xl" style={{ color: colors.white }} />,
                title: "مونتاج ذكي",
                content: "تحرير تلقائي للفيديو، إضافة فصول تلقائية، تحسين الصوت الذكي",
                gradient: `linear-gradient(135deg, ${colors.red} 0%, #B20E19 100%)`
              },
              {
                icon: <FiUsers className="text-4xl" style={{ color: colors.black }} />,
                title: "مجتمع تفاعلي",
                content: "منتديات نقاش، مجموعات دراسة، ونظام تقييم الأقران",
                gradient: `linear-gradient(135deg, ${colors.yellow} 0%, #E4BE00 100%)`
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true }}
                className="p-8 rounded-2xl relative overflow-hidden shadow-lg"
                style={{ background: feature.gradient }}
              >
                <div className="relative z-10">
                  <div className="mb-6">{feature.icon}</div>
                  <h4 
                    className="text-2xl font-bold mb-4"
                    style={{ color: index === 2 ? colors.black : colors.white }}>
                    {feature.title}
                  </h4>
                  <p 
                    className="leading-relaxed mb-6"
                    style={{ color: index === 2 ? colors.black : colors.white + 'dd' }}>
                    {feature.content}
                  </p>
                  <button 
                    className="flex items-center gap-2 hover:gap-3 transition-all"
                    style={{ color: index === 2 ? colors.black : colors.white }}>
                    <span>اكتشف المزيد</span>
                    <FiArrowRight className="text-lg" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Interactive Tutorial */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-10 flex flex-col md:flex-row gap-10 items-center border border-gray-100"
          variants={cardVariants}
        >
          <div className="flex-1 space-y-6">
            <h3 
              className="text-2xl font-bold"
              style={{ color: colors.black }}>
              دورة تفاعلية احترافية
            </h3>
            <p 
              className="leading-relaxed"
              style={{ color: colors.gray }}>
              انضم إلى ورشة العمل التفاعلية التي ستأخذك في رحلة متكاملة من الفكرة 
              إلى الإنتاج النهائي باحترافية عالية.
            </p>
            <div className="space-y-4">
              <div 
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100"
                style={{ backgroundColor: colors.white }}>
                <FiClock className="text-2xl" style={{ color: colors.blue }} />
                <div>
                  <div className="font-medium" style={{ color: colors.black }}>مدة الدورة</div>
                  <div className="text-sm" style={{ color: colors.gray }}>6 أسابيع تدريبية</div>
                </div>
              </div>
              <div 
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100"
                style={{ backgroundColor: colors.white }}>
                <FiAward className="text-2xl" style={{ color: colors.yellow }} />
                <div>
                  <div className="font-medium" style={{ color: colors.black }}>الشهادة</div>
                  <div className="text-sm" style={{ color: colors.gray }}>معتمدة دوليًا</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div 
              className="aspect-video rounded-xl shadow-lg overflow-hidden border border-gray-100"
              style={{ backgroundColor: colors.white }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  className="p-6 rounded-full shadow-2xl hover:scale-105 transition-transform"
                  style={{ backgroundColor: colors.blue }}>
                  <FiPlayCircle className="text-4xl" style={{ color: colors.white }} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div 
          className="rounded-2xl p-10 text-center shadow-xl"
          variants={cardVariants}
          style={{ backgroundColor: colors.black }}
        >
          <div className="max-w-2xl mx-auto space-y-8">
            <h3 
              className="text-3xl font-bold"
              style={{ color: colors.white }}>
              ابدأ رحلتك التعليمية اليوم
            </h3>
            <p style={{ color: colors.gray }}>
              انضم إلى أكثر من 50,000 مدرب محترف حول العالم واستفد من أدواتنا المتقدمة
            </p>
            <div className="relative pt-8">
              <div 
                className="h-2 rounded-full"
                style={{ backgroundColor: colors.gray + '40' }}>
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: '75%',
                    background: `linear-gradient(90deg, ${colors.blue} 0%, ${colors.yellow} 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between mt-4 text-sm" style={{ color: colors.gray }}>
                <span>75% اكتمال السعة</span>
                <span>مقاعد محدودة</span>
              </div>
            </div>
            <button 
              className="px-8 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
              style={{ 
                backgroundColor: colors.yellow,
                color: colors.black
              }}>
              احجز مقعدك الآن
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;