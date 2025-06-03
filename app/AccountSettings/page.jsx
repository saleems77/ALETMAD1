"use client"
import React, { useState } from 'react';

const AccountSettings = () => {
  const [activeSection, setActiveSection] = useState('security');
  const [subSection, setSubSection] = useState('');

  const sections = {
    security: {
      title: 'أمان الحساب',
      icon: '🛡️',
      subsections: [
        {
          title: 'المصادقة متعددة العوامل',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                قم بتعزيز أمان حسابك من خلال طلب إدخال رمز يتم إرساله إليك عبر البريد الإلكتروني 
                عند تسجيل الدخول. راجع مركز المساعدة لمزيد من التفاصيل.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">كيفية الإعداد:</h4>
                <ol className="list-decimal pr-6 space-y-3 text-gray-700">
                  <li>انتقل إلى إعدادات الأمان</li>
                  <li>اختر "تفعيل المصادقة الثنائية"</li>
                  <li>اتبع الخطوات التأكيدية</li>
                </ol>
              </div>
            </div>
          )
        },
        {
          title: 'إدارة الأجهزة',
          content: 'عرض الأجهزة المتصلة وإدارة الصلاحيات'
        }
      ]
    },
    gena1: {
      title: 'برنامج GenA1',
      icon: '🚀',
      subsections: [
        {
          title: 'الأهداف الرئيسية',
          content: [
            'تحسين تجربة التعلم الذاتي',
            'زيادة كفاءة إدارة المحتوى',
            'أدوات محتوى ذكية'
          ]
        },
        {
          title: 'مزايا المشاركة',
          content: [
            'وصول مبكر للميزات الجديدة',
            'دعم فني مخصص',
            'تقارير أداء مفصلة'
          ]
        }
      ]
    },
    challenges: {
      title: 'التحديات والعروض',
      icon: '🏆',
      subsections: [
        {
          title: 'العروض الحالية',
          content: [
            'إطلاق المنتجات الجديدة',
            'عروض تزويد خاصة',
            'خصومات موسمية'
          ]
        }
      ]
    },
    learning: {
      title: 'تعلمات',
      icon: '📚',
      subsections: [
        {
          title: 'التقارير التعليمية',
          content: [
            'إحصائيات التعلم',
            'توصيات الدورة',
            'إخطارات المدربين'
          ]
        }
      ]
    },
    messages: {
      title: 'الرسائل',
      icon: '📩',
      subsections: [
        {
          title: 'إعدادات الرسائل',
          content: 'إدارة تفضيلات الرسائل المباشرة'
        },
        {
          title: 'الإشعارات',
          content: 'التحكم في أنواع الإشعارات وتوقيتها'
        }
      ]
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6" dir="rtl">
      {/* شريط التنقل الرئيسي */}
      <div className="flex gap-4 border-b-2 border-gray-200 pb-4 mb-6 overflow-x-auto">
        {Object.entries(sections).map(([key, section]) => (
          <button
            key={key}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-lg shrink-0 ${
              activeSection === key 
                ? `${getSectionColor(key).bg} ${getSectionColor(key).text} font-semibold`
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => {
              setActiveSection(key);
              setSubSection('');
            }}
          >
            <span>{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>

      {/* محتوى الأقسام */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* القائمة الفرعية */}
        <div className="lg:col-span-1 space-y-2">
          {sections[activeSection].subsections.map((item, index) => (
            <button
              key={index}
              className={`w-full text-right p-3 rounded-lg ${
                subSection === item.title 
                  ? `${getSectionColor(activeSection).subBg} 
                     ${getSectionColor(activeSection).border} 
                     border-r-4`
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setSubSection(item.title)}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* تفاصيل المحتوى */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm">
          {renderContent(activeSection, subSection)}
        </div>
      </div>

      {/* قسم إغلاق الحساب */}
      {activeSection === 'security' && (
        <div className="mt-8 p-6 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-red-600 font-semibold text-lg mb-3">إغلاق الحساب</h3>
          <p className="text-red-500 text-sm mb-4">
            سيتم حذف جميع البيانات بشكل دائم ولا يمكن استرجاعها
          </p>
          <button className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
            تأكيد الإغلاق
          </button>
        </div>
      )}
    </div>
  );

  function getSectionColor(section) {
    const colors = {
      security: { bg: 'bg-blue-100', text: 'text-blue-600', subBg: 'bg-blue-50', border: 'border-blue-500' },
      gena1: { bg: 'bg-purple-100', text: 'text-purple-600', subBg: 'bg-purple-50', border: 'border-purple-500' },
      challenges: { bg: 'bg-orange-100', text: 'text-orange-600', subBg: 'bg-orange-50', border: 'border-orange-500' },
      learning: { bg: 'bg-green-100', text: 'text-green-600', subBg: 'bg-green-50', border: 'border-green-500' },
      messages: { bg: 'bg-pink-100', text: 'text-pink-600', subBg: 'bg-pink-50', border: 'border-pink-500' }
    };
    return colors[section] || colors.security;
  }

  function renderContent(activeSection, subSection) {
    const content = sections[activeSection].subsections.find(
      item => item.title === subSection
    )?.content;

    if (!content) return (
      <div className="text-center text-gray-500 py-12">
        <p className="text-lg">اختر قسمًا فرعيًا لعرض التفاصيل</p>
      </div>
    );

    return (
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
          {subSection}
        </h3>
        
        {Array.isArray(content) ? (
          <ul className="list-disc pr-6 space-y-3 text-gray-600">
            {content.map((point, i) => (
              <li key={i} className="leading-relaxed">{point}</li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-600 leading-relaxed space-y-4">
            {content}
          </div>
        )}

        {activeSection === 'learning' && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-700">
              ملاحظة: قد يستغرق ظهور التغييرات بعض الوقت
            </p>
          </div>
        )}
      </div>
    );
  }
};

export default AccountSettings;