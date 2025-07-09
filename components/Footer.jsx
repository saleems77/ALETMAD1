// components/DynamicFooter.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { FiExternalLink, FiChevronLeft, FiAward, FiCode, FiPenTool, 
        FiDatabase, FiBarChart2, FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';

// الألوان المحددة للواجهة
const colors = {
  primary: '#008DCB',    // Blue - 50%
  dark: '#0D1012',       // Black - 15%
  secondary: '#F9D011',  // Yellow - 15%
  accent: '#E2101E',     // Red - 10%
  light: '#FFFFFF',      // White - 10%
  neutral: '#999999'     // Gray - 10%
};

// تعيين الأيقونات بناءً على نوع المنصة الاجتماعية
const getSocialIcon = (platform) => {
  switch(platform?.toLowerCase()) {
    case 'facebook': return <FiFacebook />;
    case 'twitter': return <FiTwitter />;
    case 'instagram': return <FiInstagram />;
    case 'linkedin': return <FiLinkedin />;
    default: return <FiExternalLink />;
  }
};

export default function DynamicFooter() {
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  // جلب جميع السياسات النشطة من Strapi
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        // استخدام populate للحصول على المنصات الاجتماعية
        const res = await axios.get(
          `${API_URL}/policies?filters[is_active][$eq]=true&populate=platform`
        );
        
        if (res.data?.data?.length > 0) {
          setPolicies(res.data.data);
        } else {
          setError('لا توجد سياسات نشطة في النظام');
        }
      } catch (err) {
        setError('فشل تحميل بيانات الفوتر: ' + 
          (err.response?.data?.error?.message || err.message));
        console.error('Error fetching policies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  return (
    <footer className="relative overflow-hidden" dir="rtl">
      {/* الخلفية المتدرجة */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#008DCB]/20 to-[#0D1012] -z-10" />
      
      {/* المحتوى الرئيسي */}
      <div className="bg-[#0D1012] pt-16 pb-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* قسم الشعارات */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div className="space-y-4 text-center md:text-right">
              <h2 className="text-2xl font-bold" style={{ color: colors.primary }}>
                <FiAward className="inline-block mr-2 mb-1" />
                {policies.length > 0 ? policies[0].title : 'شركاء النجاح العالميين'}
              </h2>
              <p className="text-sm" style={{ color: colors.neutral }}>
                {policies.length > 0 ? policies[0].instruction : 'نتعاون مع أفضل المنصات العالمية لتقديم المحتوى التعليمي'}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-12">
              <div className="relative group">
                <Image
                  src="/الاعتماد العربي.png"
                  alt="الاعتماد العربي"
                  width={120}
                  height={40}
                  className="h-10 object-contain opacity-80 hover:opacity-100 transition-opacity"
                  style={{ filter: 'grayscale(1) contrast(0.5)' }}
                />
                <div 
                  className="absolute inset-0 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ borderColor: colors.primary }}
                />
              </div>
            </div>
          </div>
          
          {/* القوائم الرئيسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
            {error && (
              <div className="col-span-5 text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            )}
            
            {isLoading ? (
              <div className="col-span-5 text-center py-8">
                <p className="text-gray-500">جارٍ تحميل البيانات...</p>
              </div>
            ) : policies.length > 0 ? (
              policies.map((policy, policyIndex) => (
                <React.Fragment key={policy.documentId}>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: colors.primary }}>
                      <div className="p-2 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
                        {React.cloneElement(
                          policyIndex === 0 ? <FiAward /> : 
                          policyIndex === 1 ? <FiCode /> : 
                          policyIndex === 2 ? <FiPenTool /> : 
                          policyIndex === 3 ? <FiDatabase /> : <FiBarChart2 />, 
                          { 
                            className: 'text-xl',
                            style: { color: colors.primary } 
                          }
                        )}
                      </div>
                      <h3 className="text-lg font-semibold" style={{ color: colors.light }}>
                        {policy.title}
                      </h3>
                    </div>
                    
                    {/* عرض المحتوى كاملاً بدون اختصار */}
                    <div className="text-sm" style={{ color: colors.neutral }}>
                      {policy.content}
                    </div>
                    
                    {/* عرض التعليمات إذا كانت موجودة */}
                    {policy.instruction && (
                      <div className="text-sm mt-2" style={{ color: colors.neutral }}>
                        <span className="font-medium" style={{ color: colors.secondary }}>التعليمات:</span>
                        <p className="mt-1">{policy.instruction}</p>
                      </div>
                    )}
                    
                    {/* عرض الإشعار إذا كان موجودًا */}
                    {policy.notification && (
                      <div className="text-sm mt-2" style={{ color: colors.neutral }}>
                        <span className="font-medium" style={{ color: colors.secondary }}>الإشعار:</span>
                        <p className="mt-1">{policy.notification}</p>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="col-span-5 text-center py-8">
                <p className="text-gray-500">لا توجد سياسات متاحة</p>
              </div>
            )}
          </div>
          
          {/* حقوق النشر والشبكات الاجتماعية */}
          <div className="border-t pt-12" style={{ borderColor: colors.primary + '30' }}>
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              <div className="text-center lg:text-right">
                <h4 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>
                  {policies.length > 0 ? 'الإعتــمـاد العــربــي' : 'الريادة في التعليم الرقمي العالمي'}
                </h4>
                <p className="text-sm" style={{ color: colors.neutral }}>
                  © {new Date().getFullYear()} جميع الحقوق محفوظة
                  <br />
                  {policies.length > 0 ? policies[0].sociallink : 'الريادة في التعليم الرقمي العالمي'}
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-6">
                  {policies.map((policy, index) => (
                    policy.platform && (
                      <a
                        key={index}
                        href={policy.platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                        style={{ color: colors.light }}
                      >
                        {getSocialIcon(policy.platform.platform)}
                      </a>
                    )
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
    </footer>
  );
}