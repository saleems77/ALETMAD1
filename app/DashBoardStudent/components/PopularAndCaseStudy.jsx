"use client"
import React from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaChartLine, FaRocket, FaUsers, FaRegClock, FaBookOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const colors = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

const PopularAndCaseStudy = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-20" style={{ backgroundColor: colors.white }} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        {/* Trending Now Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-8" style={{ color: colors.black }}>
            {t?.popular?.title}
            <span className="block w-32 h-1 mt-2" style={{ backgroundColor: colors.blue }}></span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
            {/* Highlight Card */}
            <div className="col-span-1 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                style={{ backgroundColor: colors.blue }}>
              <div style={{ color: colors.white }}>
                <FaRocket className="w-12 h-12" style={{ color: colors.yellow }} />
                <h3 className="text-xl font-semibold mb-4">{t?.popular?.highlight?.title}</h3>
                <a href="#" className="inline-flex items-center font-medium hover:opacity-90">
                  <span>{t?.popular?.highlight?.linkText}</span>
                  <FaArrowLeft className={`${language === 'ar' ? 'mr-3' : 'ml-3'} transform ${language === 'en' ? 'rotate-180' : ''}`} />
                </a>
                <div className="mt-6 rounded-lg p-4" style={{ backgroundColor: colors.black }}>
                  <p className="text-sm flex items-center">
                    <FaUsers className={language === 'ar' ? 'ml-2' : 'mr-2'} style={{ color: colors.yellow }} />
                    {t?.popular?.highlight?.learners}
                  </p>
                </div>
              </div>
            </div>

            {/* Categories */}
            {t?.popular?.categories?.map((cat, idx) => (
              <div key={idx} className="p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: colors.white, border: `1px solid ${colors.gray}` }}>
                <h4 className="text-lg font-semibold mb-6 flex items-center" style={{ color: colors.blue }}>
                  {cat.icon === 'chart' && <FaChartLine className={language === 'ar' ? 'ml-2' : 'mr-2'} />}
                  {cat.icon === 'book' && <FaBookOpen className={language === 'ar' ? 'ml-2' : 'mr-2'} />}
                  {cat.icon === 'rocket' && <FaRocket className={language === 'ar' ? 'ml-2' : 'mr-2'} />}
                  {cat.title}
                </h4>
                <ul className="space-y-6">
                  {cat.items.map((item, i) => (
                    <li key={i} className="group">
                      <a href={item.link} className="block p-3 rounded-lg transition-all hover:bg-opacity-10"
                        style={{ backgroundColor: item.trending ? colors.yellow + '20' : item.new ? colors.red + '20' : 'transparent' }}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium" style={{ color: colors.black }}>
                            {item.text}
                            {item.trending && (
                              <span 
                              className={`
                                px-2 py-1 text-xs rounded-full 
                                ${language === 'ar' ? 'ml-2' : 'mr-2'}
                              `}
                              style={{ backgroundColor: colors.yellow + '30', color: colors.black }}
                            >
                              {t?.popular?.trendingTag}
                            </span>
                            )}
                            {item.new && (
                              <span 
                              className={`
                                px-2 py-1 text-xs rounded-full 
                                ${language === 'ar' ? 'ml-2' : 'mr-2'}
                              `}
                              style={{ backgroundColor: colors.red + '30', color: colors.black }}
                            >
                              {t?.popular?.newTag}
                            </span>
                            )}
                          </span>
                          <FaArrowLeft className={`text-sm transform ${language === 'en' ? 'rotate-180' : ''}`} style={{ color: colors.gray }} />
                        </div>
                        <p className="text-xs mt-2 flex items-center" style={{ color: colors.gray }}>
                          <FaRegClock className={language === 'ar' ? 'ml-1' : 'mr-1'} />
                          {item.learners}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Case Study Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: colors.blue }}
        >
          
        </motion.div>
      </div>
    </section>
  );
};

export default PopularAndCaseStudy;