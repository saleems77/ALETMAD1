'use client';
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  FiExternalLink, FiChevronLeft, FiAward, FiCode, FiPenTool, 
  FiDatabase, FiBarChart2, FiFacebook, FiTwitter, FiLinkedin, FiInstagram 
} from "react-icons/fi";

// الألوان المحددة
const colors = {
  primary: '#008DCB',    // Blue - 50%
  dark: '#0D1012',       // Black - 15%
  secondary: '#F9D011',  // Yellow - 15%
  accent: '#E2101E',     // Red - 10%
  light: '#FFFFFF',      // White - 10%
  neutral: '#999999'     // Gray - 10%
};

const Footer = () => {
  const logos = [
    { 
      name: "Nasdaq",
      src: "https://upload.wikimedia.org/wikipedia/commons/8/88/Nasdaq_Logo.svg",
      link: "https://www.nasdaq.com"
    },
    {
      name: "NetApp",
      src: "https://upload.wikimedia.org/wikipedia/commons/9/9d/NetApp_Logo.svg",
      link: "https://www.netapp.com"
    },
    {
      name: "Eventbrite",
      src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Eventbrite_Logo.svg",
      link: "https://www.eventbrite.com"
    }
  ];

  const sections = [
    {
      title: "الشهادات والاعتمادات",
      items: ['AWS Certification', 'Cisco', 'Microsoft', 'Oracle', 'CompTIA'],
      icon: <FiAward />
    },
    {
      title: "التطوير البرمجي",
      items: ['JavaScript', 'Python', 'React', 'Node.js', 'Angular'],
      icon: <FiCode />
    },
    {
      title: "التصميم والإعلام",
      items: ['Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'UI/UX'],
      icon: <FiPenTool />
    },
    {
      title: "البيانات والتسويق",
      items: ['Data Science', 'Big Data', 'SEO', 'Digital Marketing', 'Social Media'],
      icon: <FiDatabase />
    },
    {
      title: "مجالات أخرى",
      items: ['إدارة المشاريع', 'ريادة الأعمال', 'اللغات والترجمة', 'الموارد البشرية', 'المزيد ...'],
      icon: <FiBarChart2 />
    }
  ];

  const socialMedia = [
    { icon: <FiFacebook />, link: "#" },
    { icon: <FiTwitter />, link: "#" },
    { icon: <FiLinkedin />, link: "#" },
    { icon: <FiInstagram />, link: "#" }
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
      dir="rtl"
    >
      {/* الخلفية المتدرجة */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#008DCB]/20 to-[#0D1012] -z-10" />
      
      {/* المحتوى الرئيسي */}
      <div className="bg-[#0D1012] pt-16 pb-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* قسم الشعارات */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16"
          >
            <div className="space-y-4 text-center md:text-right">
              <h2 className="text-2xl font-bold" style={{ color: colors.primary }}>
                <FiAward className="inline-block mr-2 mb-1" />
                شركاء النجاح العالميين
              </h2>
              <p className="text-sm" style={{ color: colors.neutral }}>
                نتعاون مع أفضل المنصات العالمية لتقديم المحتوى التعليمي
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-12">
              {logos.map((logo, index) => (
                <motion.a
                  key={index}
                  href={logo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={120}
                    height={40}
                    className="h-10 object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ filter: 'grayscale(1) contrast(0.5)' }}
                  />
                  <div 
                    className="absolute inset-0 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ borderColor: colors.primary }}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* القوائم الرئيسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
            {sections.map((section, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: colors.primary }}>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
                    {React.cloneElement(section.icon, { 
                      className: 'text-xl',
                      style: { color: colors.primary } 
                    })}
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: colors.light }}>
                    {section.title}
                  </h3>
                </div>
                
                <ul className="space-y-4">
                  {section.items.map((item, idx) => (
                    <motion.li
                      key={idx}
                      whileHover={{ x: 5 }}
                      className="group"
                    >
                      <a 
                        href="#"
                        className="flex items-center justify-between py-2 transition-all"
                        style={{ color: colors.neutral }}
                      >
                        <div className="flex items-center gap-2">
                          <FiChevronLeft 
                            className="transition-transform group-hover:translate-x-1"
                            style={{ color: colors.primary }}
                          />
                          <span className="group-hover:text-white transition-colors">
                            {item}
                          </span>
                        </div>
                        <div 
                          className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: colors.primary }}
                        />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* حقوق النشر والشبكات الاجتماعية */}
          <div className="border-t pt-12" style={{ borderColor: colors.primary + '30' }}>
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              <div className="text-center lg:text-right">
                <h4 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>
                  الإعتــمـاد العــربــي
                </h4>
                <p className="text-sm" style={{ color: colors.neutral }}>
                  © {new Date().getFullYear()} جميع الحقوق محفوظة
                  <br />
                  الريادة في التعليم الرقمي العالمي
                </p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-6">
                  {socialMedia.map((media, index) => (
                    <motion.a
                      key={index}
                      href={media.link}
                      target="_blank"
                      whileHover={{ scale: 1.1 }}
                      className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                      style={{ color: colors.light }}
                    >
                      {React.cloneElement(media.icon, {
                        className: 'text-xl'
                      })}
                    </motion.a>
                  ))}
                </div>
                
                <div className="flex gap-6 flex-wrap justify-center">
                  {['الشروط والأحكام', 'سياسة الخصوصية', 'خريطة الموقع'].map((item, index) => (
                    <a 
                      key={index}
                      href="#"
                      className="text-sm relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:transition-all hover:after:w-full"
                      style={{
                        color: colors.neutral,
                        after: { backgroundColor: colors.primary }
                      }}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* التأثيرات الجانبية */}
        <div 
          className="absolute top-1/2 left-0 w-48 h-48 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: colors.primary }}
        />
        <div 
          className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-15"
          style={{ backgroundColor: colors.secondary }}
        />
      </div>
    </motion.footer>
  );
};

export default Footer;