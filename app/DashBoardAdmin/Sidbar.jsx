import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUsers,
  faBookOpen,
  faHeadset,
  faTools,
  faComments,
  faChartLine,
  faPlusCircle,
  faCertificate,
  faEnvelope,
  faPhoneAlt,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons';

const theme = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

const alpha = (color, opacity) => `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
const categories = [
  {
    title: 'الرئيسية',
    icon: faHome,
    items: [{ key: 'dashboard', label: 'لوحة التحكم', icon: faHome }]
  },
  {
    title: 'إدارة المستخدمين',
    icon: faUsers,
    items: [
      { key: 'addstudent', label: 'إضافة متدرب جديد', icon: faPlusCircle },
      { key: 'tracker', label: 'تفاعل المستخدمين', icon: faChartLine }
    ]
  },
  {
    title: 'المحتوى',
    icon: faBookOpen,
    items: [
      { key: 'content', label: 'المحتوى والدورات', icon: faBookOpen },
      { key: 'certif', label: 'إدارة الشهادات', icon: faCertificate },
    ]
  },
  {
    title: 'الدعم والمنصة',
    icon: faHeadset,
    items: [
      { key: 'support', label: 'الدعم والتذاكر', icon: faHeadset },
      { key: 'email', label: 'إدارة النظام البريدي', icon: faEnvelope },
      { key: 'crm', label: 'CRM', icon: faComments },
      { key: 'saas', label: 'ادارة التراخيص SaaS', icon: faFileAlt },
      { key: 'legal', label: 'سياسة و شروط المنصة', icon: faFileAlt },
    ]
  },
  {
    title: 'الدعم الفني',
    icon: faTools,
    items: [
      { key: 'finance', label: 'الدعم الفني', icon: faTools },
      { key: 'support', label: 'المهام التشغيلية', icon: faTools }
    ]
  },
  {
    title: 'الاتصالات',
    icon: faPhoneAlt,
    items: [
      { key: 'user', label: 'نظام التواصل الداخلي', icon: faComments },
      { key: 'voip', label: 'إدارة المكالمات VOIP', icon: faPhoneAlt }
    ]
  },
  {
    title: 'التقارير',
    icon: faChartLine,
    items: [
      { key: 'report', label: ' نظام التقارير ', icon: faChartLine },
    ]
  }
];

const Sidebar = ({ activeSection, setActiveSection }) => {
  const [expandedCategories, setExpandedCategories] = useState(['الرئيسية']);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);
  };

  return (
    <aside 
      className="w-72 fixed right-0 top-20 h-screen flex flex-col bg-white"
      style={{
        borderLeft: `1px solid ${alpha(theme.gray, 0.1)}`
      }}
    >
      {/* شعار بدون ظلال */}
      <div className="px-6 py-4 border-b flex items-center justify-center bg-white">
        <img 
          src="/الاعتماد العربي.png" 
          alt="Logo"
          className="h-14 object-contain"
        />
      </div>

      {/* شريط التقدم بدون ظلال */}
      <div className="h-1 bg-gray-100">
        <div 
          className="h-full bg-blue-500" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* محتوى القائمة بدون ظلال */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-3 p-4">
          {categories.map((category, index) => (
            <li key={category.title}>
              <button
                onClick={() => setExpandedCategories(prev => 
                  prev.includes(category.title) 
                    ? prev.filter(t => t !== category.title) 
                    : [...prev, category.title]
                )}
                className={`
                  w-full flex justify-between items-center px-4 py-3.5
                  rounded-2xl transition-all duration-300
                  ${expandedCategories.includes(category.title) 
                    ? 'bg-blue-50' 
                    : 'bg-white hover:bg-gray-50'
                  }
                `}
                style={{
                  border: `1px solid ${alpha(theme.gray, 0.1)}`
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2.5 rounded-xl"
                    style={{
                      background: alpha(theme.blue, 0.07)
                    }}
                  >
                    <FontAwesomeIcon 
                      icon={category.icon} 
                      className="w-5 h-5"
                      style={{
                        color: expandedCategories.includes(category.title) 
                          ? theme.blue 
                          : theme.gray
                      }}
                    />
                  </div>
                  <span 
                    className="font-semibold text-sm"
                    style={{
                      color: expandedCategories.includes(category.title) 
                        ? theme.blue 
                        : theme.black
                    }}
                  >
                    {category.title}
                  </span>
                </div>
                
                <svg
                  className={`w-5 h-5 transition-transform duration-300 
                    ${expandedCategories.includes(category.title) ? 'rotate-180' : ''}`}
                  style={{
                    color: expandedCategories.includes(category.title) ? theme.blue : theme.gray
                  }}
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </button>

              <ul 
                className={`ml-10 space-y-2 overflow-hidden transition-all
                  ${expandedCategories.includes(category.title) 
                    ? 'max-h-96 opacity-100 mt-2' 
                    : 'max-h-0 opacity-0'
                  }`}
              >
                {category.items.map((item, idx) => (
                  <li key={item.key}>
                    <button
                      onClick={() => setActiveSection(item.key)}
                      className={`
                        w-full text-right px-4 py-2.5 rounded-xl 
                        transition-all duration-300 flex items-center gap-3
                        ${activeSection === item.key 
                          ? 'bg-blue-100' 
                          : 'bg-white hover:bg-gray-50'
                        }
                      `}
                      style={{
                        border: `1px solid ${alpha(theme.gray, 0.1)}`
                      }}
                    >
                      <FontAwesomeIcon 
                        icon={item.icon} 
                        className="w-4 h-4"
                        style={{
                          color: activeSection === item.key 
                            ? theme.blue 
                            : theme.gray
                        }}
                      />
                      <span className="flex-1 text-sm font-medium pr-1">
                        {item.label}
                      </span>
                      
                      {item.key === 'support' && (
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.red }}
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      {/* قسم الإشعارات بدون ظلال */}
      <div className="mx-4 mb-4 p-4 rounded-2xl" style={{
        backgroundColor: alpha(theme.yellow, 0.08),
        border: `1px solid ${alpha(theme.yellow, 0.15)}`
      }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: alpha(theme.yellow, 0.15)
            }}
          >
            <FontAwesomeIcon 
              icon={faFileAlt} 
              className="w-4 h-4"
              style={{ color: theme.yellow }}
            />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: theme.black }}>
              3 تحديثات جديدة
            </p>
            <p className="text-xs mt-1" style={{ color: theme.gray }}>
              آخر تحديث: ٢٤ ساعة
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;