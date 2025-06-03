'use client';
import { useEffect, useState } from 'react';
import ActivityLogs from './ActivityLogs';
import {
  ClockIcon,
  CalendarIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import { Tab } from '@headlessui/react';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

// تعريف الثيم اللوني
const theme = {
  blue: '#008DCB',
  black: '#000000',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
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
    { name: 'النشاطات', count: activityLogs.length },
    { name: 'المعلومات الشخصية', count: null },
  ];

  return (
    <div className="fixed inset-0 bg-[rgba(13,16,18,0.8)] backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        style={{ backgroundColor: theme.white }}
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: theme.gray + '40' }}>
          <div>
            <h2 id="modal-title" className="text-2xl font-bold" style={{ color: theme.black }}>
              {member.name}
            </h2>
            <p className="text-sm mt-1" style={{ color: theme.gray }}>
              <span className="inline-flex items-center gap-1">
                <UserCircleIcon className="w-4 h-4" style={{ color: theme.blue }} />
                {member.position}
              </span>
            </p>
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
          <Tab.List className="flex border-b px-6" style={{ borderColor: theme.gray + '40' }}>
            {tabs.map((tab, idx) => (
              <Tab
                key={idx}
                className={({ selected }) => `
                  px-4 py-3 text-sm font-medium relative flex items-center
                  ${selected 
                    ? 'border-b-2' 
                    : 'hover:opacity-80'}
                `}
                style={{ 
                  color: selectedTab === idx ? theme.blue : theme.gray,
                  borderColor: selectedTab === idx ? theme.blue : 'transparent'
                }}
              >
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
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner 
                className="w-10 h-10" 
                primaryColor={theme.blue}
                secondaryColor={theme.blue + '20'}
              />
            </div>
          ) : (
            <>
              {selectedTab === 0 && (
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
              )}
              {selectedTab === 1 && (
                <div className="space-y-6">
                  {/* معلومات الاتصال */}
                  <div 
                    className="p-5 rounded-xl border"
                    style={{ 
                      backgroundColor: theme.white,
                      borderColor: theme.gray + '40'
                    }}
                  >
                    <h3 
                      className="text-lg font-semibold mb-4"
                      style={{ color: theme.black }}
                    >
                      معلومات الاتصال
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <div 
                          className="p-2 rounded-lg shadow-sm"
                          style={{ 
                            backgroundColor: theme.blue + '10',
                            boxShadow: `0 1px 2px ${theme.gray}20`
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
                          className="p-2 rounded-lg shadow-sm"
                          style={{ 
                            backgroundColor: theme.blue + '10',
                            boxShadow: `0 1px 2px ${theme.gray}20`
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
                      className="text-lg font-semibold mb-4"
                      style={{ color: theme.black }}
                    >
                      معلومات النظام
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label 
                          className="text-sm flex items-center gap-2"
                          style={{ color: theme.gray }}
                        >
                          <CalendarIcon className="w-4 h-4" style={{ color: theme.gray }} />
                          تاريخ الانضمام
                        </label>
                        <p className="font-medium" style={{ color: theme.black }}>
                          {new Date(member.joinDate).toLocaleDateString('ar-EG', {
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
