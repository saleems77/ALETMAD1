// MemberDetailsModal.jsx
'use client';
import { useEffect, useState } from 'react';
import ActivityLogs from './ActivityLogs';
import {
  ClockIcon,
  CalendarIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  XMarkIcon,
  ShieldCheckIcon,
  KeyIcon
} from '@heroicons/react/24/solid';
import { Tab } from '@headlessui/react';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

const theme = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

// نفس قاموس الترجمة المستخدم في المكونات الأخرى
const PERMISSION_TRANSLATIONS = {
  'create_user': 'إنشاء مستخدمين',
  'edit_user': 'تعديل المستخدمين',
  'delete_user': 'حذف المستخدمين',
  'view_users': 'عرض المستخدمين',
  'create_course': 'إنشاء دورات',
  'edit_course': 'تعديل الدورات',
  'delete_course': 'حذف الدورات',
  'publish_course': 'نشر الدورات',
  'enroll_students': 'تسجيل الطلاب',
  'manage_grades': 'إدارة الدرجات',
  'view_progress': 'متابعة التقدم',
  'view_payments': 'عرض المدفوعات',
  'manage_invoices': 'إدارة الفواتير',
  'financial_reports': 'التقارير المالية',
  'create_campaigns': 'إنشاء حملات',
  'manage_promotions': 'إدارة العروض',
  'analytics_view': 'تحليل الأداء',
  'manage_employees': 'إدارة الموظفين',
  'manage_attendance': 'إدارة الحضور',
  'payroll_management': 'إدارة الرواتب',
  'system_settings': 'إعدادات النظام',
  'manage_roles': 'إدارة الأدوار',
  'backup_restore': 'النسخ الاحتياطي'
};

export default function MemberDetailsModal({ member, onClose, activityLogs, isLoading }) {
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    document.body.classList.add('overflow-hidden');
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.classList.remove('overflow-hidden');
    };
  }, [onClose]);

  const tabs = [
    { name: 'النشاطات', count: activityLogs.length, icon: ClockIcon },
    { name: 'المعلومات', count: null, icon: UserCircleIcon },
    { name: 'الصلاحيات', count: member.permissions?.length || 0, icon: ShieldCheckIcon }
  ];

  // تحويل كائن الصلاحيات إلى مصفوفة
  const permissionsArray = member.permissions && typeof member.permissions === 'object' 
    ? Object.entries(member.permissions)
        .filter(([_, value]) => value === true)
        .map(([key]) => key)
    : member.permissions || [];

  // ترجمة الصلاحيات إلى عربية
  const translatedPermissions = permissionsArray.map(perm => 
    PERMISSION_TRANSLATIONS[perm] || perm
  );

  return (
    <div className="fixed inset-0 bg-[rgba(13,16,18,0.8)] backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ backgroundColor: theme.white }}
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: theme.gray + '40' }}>
          <div>
            <h2 id="modal-title" className="text-2xl font-bold" style={{ color: theme.black }}>
              {member.username}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: theme.blue + '20',
                  color: theme.blue
                }}
              >
                {member.role?.name || 'بدون دور'}
              </span>
              <span className="text-sm" style={{ color: theme.gray }}>
                {member.email}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            style={{ '--tw-bg-opacity': 0.1 }}
            aria-label="إغلاق"
          >
            <XMarkIcon className="w-6 h-6" style={{ color: theme.black }} />
          </button>
        </div>

        {/* Tabs Navigation */}
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex border-b" style={{ borderColor: theme.gray + '40' }}>
            {tabs.map((tab, idx) => (
              <Tab
                key={idx}
                className={({ selected }) => `
                  px-4 py-3 text-sm font-medium relative flex items-center gap-2
                  ${selected 
                    ? 'border-b-2' 
                    : 'hover:opacity-80'}
                `}
                style={{ 
                  color: selectedTab === idx ? theme.blue : theme.gray,
                  borderColor: selectedTab === idx ? theme.blue : 'transparent'
                }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
                {tab.count !== null && (
                  <span 
                    className="ml-2 px-2 py-1 rounded-full text-xs"
                    style={{ 
                      backgroundColor: theme.blue + '20',
                      color: theme.blue
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner 
                className="w-10 h-10" 
                primaryColor={theme.blue}
                secondaryColor={theme.blue + '20'}
              />
            </div>
          ) : (
            <Tab.Panels className="flex-1">
              {/* Activity Tab */}
              <Tab.Panel className="p-6">
                <ActivityLogs 
                  logs={activityLogs} 
                  emptyState={
                    <EmptyState
                      icon={<ClockIcon className="w-12 h-12" style={{ color: theme.gray }} />}
                      title="لا توجد نشاطات مسجلة"
                      description="سيظهر هنا أي نشاط يقوم به العضو بمجرد حدوثه"
                      titleColor={theme.black}
                      descriptionColor={theme.gray}
                    />
                  }
                  logStyle={{
                    iconColor: theme.blue,
                    timestampColor: theme.gray,
                    borderColor: theme.gray + '40'
                  }}
                />
              </Tab.Panel>
              
              {/* Information Tab */}
              <Tab.Panel className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* معلومات الاتصال */}
                  <div 
                    className="p-5 rounded-xl border"
                    style={{ 
                      backgroundColor: theme.white,
                      borderColor: theme.gray + '40'
                    }}
                  >
                    <h3 
                      className="text-lg font-semibold mb-4 flex items-center gap-2"
                      style={{ color: theme.black }}
                    >
                      <EnvelopeIcon className="w-5 h-5" style={{ color: theme.blue }} />
                      معلومات الاتصال
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ 
                            backgroundColor: theme.blue + '10',
                          }}
                        >
                          <EnvelopeIcon className="w-5 h-5" style={{ color: theme.blue }} />
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: theme.gray }}>البريد الإلكتروني</p>
                          <p className="font-medium" style={{ color: theme.black }}>{member.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ 
                            backgroundColor: theme.blue + '10',
                          }}
                        >
                          <PhoneIcon className="w-5 h-5" style={{ color: theme.blue }} />
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: theme.gray }}>رقم الجوال</p>
                          <p className="font-medium" style={{ color: theme.black }}>
                            {member.phone || (
                              <span style={{ color: theme.gray }}>غير متوفر</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* معلومات النظام */}
                  <div 
                    className="p-5 rounded-xl border"
                    style={{ 
                      borderColor: theme.gray + '40',
                      backgroundColor: theme.white
                    }}
                  >
                    <h3 
                      className="text-lg font-semibold mb-4 flex items-center gap-2"
                      style={{ color: theme.black }}
                    >
                      <KeyIcon className="w-5 h-5" style={{ color: theme.blue }} />
                      معلومات النظام
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label 
                          className="text-sm flex items-center gap-2"
                          style={{ color: theme.gray }}
                        >
                          <CalendarIcon className="w-4 h-4" style={{ color: theme.gray }} />
                          تاريخ الانضمام
                        </label>
                        <p className="font-medium" style={{ color: theme.black }}>
                          {new Date(member.createdAt).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <label 
                          className="text-sm flex items-center gap-2"
                          style={{ color: theme.gray }}
                        >
                          <ClockIcon className="w-4 h-4" style={{ color: theme.gray }} />
                          آخر دخول
                        </label>
                        <p className="font-medium" style={{ color: theme.black }}>
                          {member.lastLogin 
                            ? new Date(member.lastLogin).toLocaleString('ar-EG', {
                                dateStyle: 'short',
                                timeStyle: 'short'
                              })
                            : <span style={{ color: theme.gray }}>غير متوفر</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* حالة العضو */}
                <div 
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ 
                    backgroundColor: theme.yellow + '20',
                    border: `1px solid ${theme.yellow + '40'}`
                  }}
                >
                  <div 
                    className="h-2 w-2 rounded-full animate-pulse"
                    style={{ backgroundColor: theme.yellow }}
                  />
                  <span 
                    className="text-sm font-medium"
                    style={{ color: theme.yellow }}
                  >
                    نشط الآن
                  </span>
                </div>
              </Tab.Panel>
              
              {/* Permissions Tab */}
              <Tab.Panel className="p-6">
                <h3 
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: theme.black }}
                >
                  <ShieldCheckIcon className="w-5 h-5" style={{ color: theme.blue }} />
                  الصلاحيات الممنوحة ({translatedPermissions.length})
                </h3>
                
                {translatedPermissions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {translatedPermissions.map((perm, index) => (
                      <div 
                        key={index} 
                        className="p-3 rounded-lg border flex items-start gap-2"
                        style={{ 
                          backgroundColor: theme.blue + '10',
                          borderColor: theme.blue + '40'
                        }}
                      >
                        <div className="mt-0.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.blue + '20' }}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.blue }}></div>
                          </div>
                        </div>
                        <span className="font-medium" style={{ color: theme.black }}>{perm}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: theme.blue + '10' }}>
                      <ShieldCheckIcon className="w-8 h-8" style={{ color: theme.blue }} />
                    </div>
                    <h4 className="text-lg font-medium mb-2" style={{ color: theme.black }}>لا توجد صلاحيات ممنوحة</h4>
                    <p className="text-sm max-w-md mx-auto" style={{ color: theme.gray }}>
                      لم يتم منح هذا المستخدم أي صلاحيات خاصة. يمكنك تعديل الصلاحيات من لوحة إدارة الفريق.
                    </p>
                  </div>
                )}
              </Tab.Panel>
            </Tab.Panels>
          )}
        </div>
      </div>
    </div>
  );
}