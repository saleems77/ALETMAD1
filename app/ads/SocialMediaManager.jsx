import React, { useState } from 'react';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaSnapchatGhost, 
  FaWhatsapp,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaPinterest,
  FaReddit,
  FaTelegram,
  FaDiscord,
  FaSearch,
  FaSlidersH,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const SocialMediaManager = () => {
  // ألوان ثابتة حسب المطلوب
  const COLORS = {
    blue: '#008DCB',
    black: '#0D1012',
    gray: '#999999',
    red: '#E2101E',
    white: '#FFFFFF',
    yellow: '#F9D011'
  };

  const platforms = [
    { 
      name: 'Facebook', 
      icon: <FaFacebook className="text-[#1877F2]" />, 
      url: 'https://www.facebook.com/ads/manager',
      category: 'شبكات التواصل'
    },
    { 
      name: 'Instagram', 
      icon: <FaInstagram className="text-[#E1306C]" />, 
      url: 'https://business.instagram.com/',
      category: 'شبكات التواصل'
    },
    { 
      name: 'Twitter', 
      icon: <FaTwitter className="text-[#1DA1F2]" />, 
      url: 'https://ads.twitter.com/',
      category: 'شبكات التواصل'
    },
    { 
      name: 'Snapchat', 
      icon: <FaSnapchatGhost className="text-[#FFFC00]" />, 
      url: 'https://forbusiness.snapchat.com/',
      category: 'تطبيقات المراسلة'
    },
    { 
      name: 'WhatsApp', 
      icon: <FaWhatsapp className="text-[#25D366]" />, 
      url: 'https://www.whatsapp.com/business',
      category: 'تطبيقات المراسلة'
    },
    { 
      name: 'LinkedIn', 
      icon: <FaLinkedin className="text-[#0A66C2]" />, 
      url: 'https://www.linkedin.com/ad/accounts',
      category: 'شبكات مهنية'
    },
    { 
      name: 'YouTube', 
      icon: <FaYoutube className="text-[#FF0000]" />, 
      url: 'https://studio.youtube.com/',
      category: 'منصات الفيديو'
    },
    { 
      name: 'TikTok', 
      icon: <FaTiktok className="text-[#000000]" />, 
      url: 'https://ads.tiktok.com/',
      category: 'منصات الفيديو'
    },
    { 
      name: 'Pinterest', 
      icon: <FaPinterest className="text-[#E60023]" />, 
      url: 'https://ads.pinterest.com/',
      category: 'اكتشاف المحتوى'
    },
    { 
      name: 'Reddit', 
      icon: <FaReddit className="text-[#FF4500]" />, 
      url: 'https://ads.reddit.com/',
      category: 'منتديات النقاش'
    },
    { 
      name: 'Telegram', 
      icon: <FaTelegram className="text-[#0088CC]" />, 
      url: 'https://telegram.org/blog/business',
      category: 'تطبيقات المراسلة'
    },
    { 
      name: 'Discord', 
      icon: <FaDiscord className="text-[#5865F2]" />, 
      url: 'https://discord.com/branding',
      category: 'مجتمعات التفاعل'
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('all');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // تجميع المنصات حسب التصنيف
  const groupedPlatforms = platforms.reduce((acc, platform) => {
    if (!acc[platform.category]) {
      acc[platform.category] = [];
    }
    acc[platform.category].push(platform);
    return acc;
  }, {});

  // تصفية وترتيب المنصات
  const filteredPlatforms = Object.entries(groupedPlatforms)
    .filter(([category, items]) => {
      const matchesSearch = items.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesCategory = sortOption === 'all' || category === sortOption;
      
      return matchesSearch && matchesCategory;
    })
    .sort(([categoryA], [categoryB]) => categoryA.localeCompare(categoryB));

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: COLORS.white }}
    >
      <div className="max-w-6xl mx-auto">
        {/* الشريط العلوي */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 
              className="text-3xl font-bold sm:text-4xl mb-2"
              style={{ color: COLORS.black }}
            >
              إدارة منصات التواصل الاجتماعي
            </h1>
            <p 
              className="text-xl"
              style={{ color: COLORS.gray }}
            >
              قم بالوصول إلى أدوات الإعلان وإدارة الحسابات لجميع المنصات من مكان واحد
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ابحث عن منصة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ 
                  backgroundColor: COLORS.white,
                  color: COLORS.black,
                  borderColor: COLORS.gray 
                }}
              />
            </div>
            
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full py-3 pl-4 pr-10 rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ 
                  backgroundColor: COLORS.white,
                  color: COLORS.black,
                  borderColor: COLORS.gray 
                }}
              >
                <option value="all">جميع التصنيفات</option>
                {Object.keys(groupedPlatforms).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSlidersH className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div 
            className="rounded-xl p-5 shadow-sm"
            style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.gray}` }}
          >
            <div className="text-2xl font-bold" style={{ color: COLORS.blue }}>12</div>
            <div style={{ color: COLORS.black }}>منصة متكاملة</div>
          </div>
          <div 
            className="rounded-xl p-5 shadow-sm"
            style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.gray}` }}
          >
            <div className="text-2xl font-bold" style={{ color: COLORS.red }}>7</div>
            <div style={{ color: COLORS.black }}>أنواع تصنيفات</div>
          </div>
          <div 
            className="rounded-xl p-5 shadow-sm"
            style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.gray}` }}
          >
            <div className="text-2xl font-bold" style={{ color: COLORS.yellow }}>24/7</div>
            <div style={{ color: COLORS.black }}>دعم فني</div>
          </div>
          <div 
            className="rounded-xl p-5 shadow-sm"
            style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.gray}` }}
          >
            <div className="text-2xl font-bold" style={{ color: COLORS.blue }}>100%</div>
            <div style={{ color: COLORS.black }}>تغطية شاملة</div>
          </div>
        </div>

        {/* المنصات مصنفة */}
        <div className="space-y-6">
          {filteredPlatforms.length > 0 ? (
            filteredPlatforms.map(([category, items]) => (
              <div key={category} className="mb-8">
                <div 
                  className="flex justify-between items-center p-4 rounded-t-xl cursor-pointer"
                  style={{ 
                    backgroundColor: COLORS.blue + '10', 
                    border: `1px solid ${COLORS.blue}30`
                  }}
                  onClick={() => toggleCategory(category)}
                >
                  <h2 
                    className="text-xl font-semibold"
                    style={{ color: COLORS.blue }}
                  >
                    {category}
                  </h2>
                  <span style={{ color: COLORS.blue }}>
                    {expandedCategory === category ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>
                
                {expandedCategory === category && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4 rounded-b-xl"
                    style={{ 
                      backgroundColor: COLORS.white, 
                      border: `1px solid ${COLORS.gray}20`,
                      borderTop: 'none'
                    }}
                  >
                    {items.map((platform, index) => (
                      <a
                        key={index}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl p-5 flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                        style={{ 
                          backgroundColor: COLORS.white,
                          border: `1px solid ${COLORS.gray}30`
                        }}
                      >
                        <div className="text-4xl mb-3">{platform.icon}</div>
                        <h3 
                          className="text-lg font-medium text-center"
                          style={{ color: COLORS.black }}
                        >
                          {platform.name}
                        </h3>
                        <div 
                          className="mt-3 w-10 h-1 rounded-full"
                          style={{ backgroundColor: COLORS.blue }}
                        ></div>
                        <span 
                          className="mt-2 text-sm text-center"
                          style={{ color: COLORS.gray }}
                        >
                          إدارة الإعلانات
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div 
              className="text-center py-12 rounded-xl"
              style={{ 
                backgroundColor: COLORS.white,
                border: `1px solid ${COLORS.gray}20`
              }}
            >
              <div className="text-5xl mb-4" style={{ color: COLORS.gray }}>¯\_(ツ)_/¯</div>
              <h3 
                className="text-xl font-medium"
                style={{ color: COLORS.black }}
              >
                لم يتم العثور على منصات
              </h3>
              <p 
                className="mt-2"
                style={{ color: COLORS.gray }}
              >
                جرب استخدام مصطلحات بحث أخرى
              </p>
            </div>
          )}
        </div>

        {/* قسم المميزات */}
        <div className="mt-16">
          <h2 
            className="text-2xl font-bold text-center mb-10"
            style={{ color: COLORS.blue }}
          >
            مميزات نظام الإدارة المتكامل
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "تحليل أداء متقدم", 
                desc: "تقارير تفصيلية وأدوات تحليلية لقياس أداء حملاتك",
                color: COLORS.blue
              },
              { 
                title: "جدولة محتوى ذكية", 
                desc: "برمجة ونشر المحتوى في الأوقات المثالية للجمهور",
                color: COLORS.red
              },
              { 
                title: "إدارة متكاملة", 
                desc: "لوحة تحكم موحدة لإدارة جميع حساباتك الاجتماعية",
                color: COLORS.yellow
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="rounded-xl p-6 flex flex-col items-center text-center"
                style={{ 
                  backgroundColor: COLORS.white,
                  border: `1px solid ${COLORS.gray}20`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
              >
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                  style={{ backgroundColor: feature.color + '20' }}
                >
                  <div style={{ color: feature.color, fontSize: '1.5rem' }}>✓</div>
                </div>
                <h3 
                  className="text-xl font-semibold mb-3"
                  style={{ color: COLORS.black }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: COLORS.gray }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaManager;