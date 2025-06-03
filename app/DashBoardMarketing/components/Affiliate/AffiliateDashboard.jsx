"use client"
import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
  UserCircleIcon,
  ChartBarIcon,
  LinkIcon,
  CurrencyDollarIcon,
  ClipboardDocumentIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  Cog6ToothIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

// نظام الألوان مع النسب المحددة
const COLORS = {
  primary: '#008DCB',    // 10%
  secondary: '#0D1012',  // 5%
  neutral: '#999999',    // 20%
  accent: '#E2101E',     // 7%
  background: '#FFFFFF', // 50%
  highlight: '#F9D011'   // 8%
};

// بيانات وهمية
const mockData = {
  products: [
    {
      id: 1,
      name: 'دورة التسويق الرقمي',
      price: 299,
      commission: '30%',
      image: 'https://source.unsplash.com/random/800x600?marketing',
      referrals: 142,
      sales: 89,
      conversion: '63%'
    },
    {
      id: 2,
      name: 'أداة تحليل البيانات',
      price: 199,
      commission: '25 دولار',
      image: 'https://source.unsplash.com/random/800x600?analytics',
      referrals: 98,
      sales: 54,
      conversion: '55%'
    }
  ],
  referrals: [
    {
      id: 1,
      user: 'محمد أحمد',
      product: 'دورة التسويق',
      date: '2024-03-20',
      status: 'مكتمل',
      amount: 89.7
    },
    {
      id: 2,
      user: 'أحمد علي',
      product: 'أداة التحليل',
      date: '2024-03-19',
      status: 'معلق',
      amount: 25.0
    }
  ],
  stats: {
    totalCommission: 1147.50,
    pendingCommission: 250.0,
    totalReferrals: 240,
    conversionRate: '62%'
  }
};

const AffiliateSystem = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');

  const copyLink = (productId) => {
    navigator.clipboard.writeText(`https://affiliate.com/ref/${productId}`);
    toast.success('تم نسخ الرابط!', {
      icon: <CheckBadgeIcon className="w-6 h-6 text-green-500" />,
      style: {
        background: COLORS.background,
        color: COLORS.secondary,
        border: `1px solid ${COLORS.neutral}`
      }
    });
  };

  const filteredProducts = mockData.products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: COLORS.background }}>
      <Toaster position="top-center" />
      
      {/* الشريط الجانبي */}
      <nav className="w-72 fixed right-0 top-0 h-full p-6 shadow-xl" 
           style={{ backgroundColor: COLORS.primary }}>
        <div className="flex items-center gap-3 mb-8">
          <UserCircleIcon className="w-8 h-8" style={{ color: COLORS.background }} />
          <div>
            <h2 className="text-xl font-bold" style={{ color: COLORS.background }}>محمد أحمد</h2>
            <p className="text-sm" style={{ color: COLORS.background }}>مسوق بالعمولة</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              activeTab === 'products' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
            style={{ color: COLORS.background }}
          >
            <ShoppingCartIcon className="w-6 h-6" />
            المنتجات
          </button>
          
          <button 
            onClick={() => setActiveTab('referrals')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              activeTab === 'referrals' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
            style={{ color: COLORS.background }}
          >
            <ArrowTrendingUpIcon className="w-6 h-6" />
            الإحالات
          </button>
          
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              activeTab === 'stats' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
            style={{ color: COLORS.background }}
          >
            <ChartBarIcon className="w-6 h-6" />
            الإحصائيات
          </button>
          
          <button 
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all"
            style={{ color: COLORS.background }}
          >
            <Cog6ToothIcon className="w-6 h-6" />
            الإعدادات
          </button>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 mr-72 p-8">
        {/* شريط البحث */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: COLORS.background,
                borderColor: COLORS.neutral,
                color: COLORS.secondary
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              className="w-5 h-5 absolute right-4 top-4"
              style={{ color: COLORS.neutral }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* المحتوى الديناميكي */}
        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                className="rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: COLORS.background }}
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.secondary }}>
                    {product.name}
                  </h3>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm" style={{ color: COLORS.neutral }}>السعر</p>
                      <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                        ${product.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: COLORS.neutral }}>العمولة</p>
                      <p className="text-xl font-medium" style={{ color: COLORS.highlight }}>
                        {product.commission}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6">
                    <StatBadge label="الإحالات" value={product.referrals} color={COLORS.primary} />
                    <StatBadge label="المبيعات" value={product.sales} color={COLORS.accent} />
                    <StatBadge label="التحويل" value={product.conversion} color={COLORS.highlight} />
                  </div>

                  <button
                    onClick={() => copyLink(product.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all hover:opacity-90"
                    style={{
                      backgroundColor: COLORS.primary,
                      color: COLORS.background
                    }}
                  >
                    <ClipboardDocumentIcon className="w-5 h-5" />
                    نسخ الرابط التابع
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'referrals' ? (
          <div className="rounded-xl overflow-hidden shadow-lg" style={{ backgroundColor: COLORS.background }}>
            <table className="w-full">
              <thead className="border-b" style={{ borderColor: COLORS.neutral }}>
                <tr>
                  <th className="p-4 text-right" style={{ color: COLORS.secondary }}>المستخدم</th>
                  <th className="p-4" style={{ color: COLORS.secondary }}>المنتج</th>
                  <th className="p-4" style={{ color: COLORS.secondary }}>التاريخ</th>
                  <th className="p-4" style={{ color: COLORS.secondary }}>الحالة</th>
                  <th className="p-4" style={{ color: COLORS.secondary }}>المبلغ</th>
                </tr>
              </thead>
              <tbody>
                {mockData.referrals.map(referral => (
                  <tr 
                    key={referral.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                    style={{ borderColor: COLORS.neutral }}
                  >
                    <td className="p-4 font-medium" style={{ color: COLORS.secondary }}>{referral.user}</td>
                    <td className="p-4" style={{ color: COLORS.secondary }}>{referral.product}</td>
                    <td className="p-4 text-center" style={{ color: COLORS.neutral }}>{referral.date}</td>
                    <td className="p-4 text-center">
                      <StatusBadge status={referral.status} />
                    </td>
                    <td className="p-4 text-center font-bold" style={{ color: COLORS.secondary }}>
                      ${referral.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="إجمالي العمولات"
              value={`$${mockData.stats.totalCommission}`}
              icon={<CurrencyDollarIcon className="w-8 h-8" />}
              color={COLORS.primary}
            />
            <StatCard 
              title="عمولات معلقة"
              value={`$${mockData.stats.pendingCommission}`}
              icon={<ClockIcon className="w-8 h-8" />}
              color={COLORS.accent}
            />
            <StatCard 
              title="معدل التحويل"
              value={mockData.stats.conversionRate}
              icon={<ChartBarIcon className="w-8 h-8" />}
              color={COLORS.highlight}
            />
          </div>
        )}
      </main>
    </div>
  );
};

// المكونات المساعدة
const StatBadge = ({ label, value, color }) => (
  <div className="text-center">
    <p className="text-sm mb-1" style={{ color: COLORS.neutral }}>{label}</p>
    <p className="text-lg font-bold" style={{ color }}>{value}</p>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-sm ${
    status === 'مكتمل' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
  }`}>
    {status}
  </span>
);

const StatCard = ({ title, value, icon, color }) => (
  <div 
    className="p-6 rounded-xl shadow-lg flex items-center gap-4"
    style={{ backgroundColor: COLORS.background }}
  >
    <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
      {React.cloneElement(icon, { className: 'w-8 h-8', style: { color } })}
    </div>
    <div>
      <p className="text-sm" style={{ color: COLORS.neutral }}>{title}</p>
      <p className="text-2xl font-bold" style={{ color: COLORS.secondary }}>{value}</p>
    </div>
  </div>
);

export default AffiliateSystem;