import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faEnvelope,
  faBullhorn,
  faRobot,
  faChartLine,
  faUsers,
  faHandshake,
  faFileInvoiceDollar,
  faFileAlt,
  faChevronDown,
  faCircle
} from '@fortawesome/free-solid-svg-icons';

// تعريف الثيم بالألوان المحددة
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
    items: [
      { key: 'dashboard', label: 'إحصاءات سريعة', icon: faHome }
    ]
  },
  {
    title: 'التسويق بالإيميل',
    icon: faEnvelope,
    items: [
      { key: 'Emails', label: 'التسويق بالإيميل', icon: faEnvelope }
    ]
  },
  {
    title: 'Social Media',
    icon: faEnvelope,
    items: [
      { key: 'Social', label: 'Social Media Planner ', icon: faEnvelope }
    ]
  },
  {
    title: 'إدارة الاعلانات',
    icon: faBullhorn,
    items: [
      { key: 'Ads', label: 'Ads Manager', icon: faBullhorn }
    ]
  },
  {
    title: 'Automation Manager',
    icon: faRobot,
    items: [
      { key: 'Automation', label: 'Automation Manager', icon: faRobot }
    ]
  },
  {
    title: 'إدارة التسويق',
    icon: faChartLine,
    items: [
      { key: 'campaigns', label: 'الحملات التسويقية', icon: faChartLine },
      { key: 'promotion', label: 'ظهور المدرب في الصفحة الأولى', icon: faUsers },
      { key: 'WhiteLabel', label: 'الهوية البصرية', icon: faHandshake },
      { key: 'domin', label: 'إدارة الدومين و الصفحات التسويقية', icon: faFileInvoiceDollar },
    ]
  },
  {
    title: 'إدارة العملاء',
    icon: faUsers,
    items: [
      { key: 'leads', label: 'إدارة العملاء', icon: faUsers },
      { key: 'Affiliate', label: 'التسويق بالعمولة', icon: faHandshake },
    ]
  },
  {
    title: 'التقارير',
    icon: faFileInvoiceDollar,
    items: [
      { key: 'reports', label: 'التقارير المالية', icon: faFileInvoiceDollar }
    ]
  }
];

const Sidebar = ({ activeSection, setActiveSection }) => {
  const [expandedCategories, setExpandedCategories] = useState(['الرئيسية']);

  return (
    <aside 
      className="w-72 fixed right-0 top-20 h-screen flex flex-col bg-white border-l"
      style={{ borderColor: alpha(theme.gray, 0.1) }}
    >
      {/* شعار المنصة */}
      <div className="px-6 py-4 border-b flex items-center justify-center bg-white">
        <img 
          src="/الاعتماد العربي.png" 
          alt="Logo"
          className="h-14 object-contain"
        />
      </div>

      {/* محتوى القائمة */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-3 p-4">
          {categories.map((category) => (
            <li key={category.title}>
              <button
                onClick={() => setExpandedCategories(prev => 
                  prev.includes(category.title) 
                    ? prev.filter(t => t !== category.title) 
                    : [...prev, category.title]
                )}
                className={`
                  w-full flex justify-between items-center px-4 py-3
                  rounded-lg transition-all duration-300
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
                  <FontAwesomeIcon 
                    icon={category.icon}
                    className="w-5 h-5"
                    style={{
                      color: expandedCategories.includes(category.title) 
                        ? theme.blue 
                        : theme.gray
                    }}
                  />
                  <span className="font-semibold text-sm">
                    {category.title}
                  </span>
                </div>
                
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-4 h-4 transition-transform duration-300 
                    ${expandedCategories.includes(category.title) ? 'rotate-180' : ''}`}
                  style={{
                    color: expandedCategories.includes(category.title) ? theme.blue : theme.gray
                  }}
                />
              </button>

              <ul 
                className={`ml-8 space-y-2 overflow-hidden transition-all
                  ${expandedCategories.includes(category.title) 
                    ? 'max-h-96 opacity-100 mt-2' 
                    : 'max-h-0 opacity-0'
                  }`}
              >
                {category.items.map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => setActiveSection(item.key)}
                      className={`
                        w-full text-right px-4 py-2.5 rounded-lg 
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
                      <span className="flex-1 text-sm font-medium">
                        {item.label}
                      </span>
                      
                      {activeSection === item.key && (
                        <FontAwesomeIcon 
                          icon={faCircle}
                          className="w-2 h-2 animate-pulse"
                          style={{ color: theme.blue }}
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

      {/* قسم الإشعارات */}
      <div className="mx-4 mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
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
            <p className="text-xs" style={{ color: theme.gray }}>
              آخر تحديث: ٢٤ ساعة
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;