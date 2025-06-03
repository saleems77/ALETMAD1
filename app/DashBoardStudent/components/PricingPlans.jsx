"use client"
import React from 'react';
import { FaUser, FaUsers, FaBuilding, FaCheck, FaArrowRight, FaCrown, FaRocket, FaStar } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

const colors = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

const PricingPlans = () => {
  const { t, language } = useLanguage();

  const plans = [
    {
      title: t?.pricing?.plans?.[0]?.title,
      subtitle: t?.pricing?.plans?.[0]?.subtitle,
      icon: <FaUser className="text-[#008DCB]" size={28} />,
      price: t?.pricing?.plans?.[0]?.price,
      period: t?.pricing?.plans?.[0]?.period,
      button: t?.pricing?.plans?.[0]?.button,
      features: t?.pricing?.plans?.[0]?.features,
      borderColor: `border-[${colors.blue}]`,
      buttonStyle: `bg-[${colors.blue}] hover:bg-[#0075a9]`
    },
    {
      title: t?.pricing?.plans?.[1]?.title,
      subtitle: t?.pricing?.plans?.[1]?.subtitle,
      icon: <FaUsers className="text-[#008DCB]" size={32} />,
      price: t?.pricing?.plans?.[1]?.price,
      period: t?.pricing?.plans?.[1]?.period,
      button: t?.pricing?.plans?.[1]?.button,
      features: t?.pricing?.plans?.[1]?.features,
      badge: (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F9D011] text-[#0D1012] px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 border-2 border-[#0D1012]/10">
          <FaStar className="text-[#E2101E]" /> {t?.pricing?.plans?.[1]?.badgeText}
        </div>
      ),
      borderColor: `border-[${colors.yellow}]`,
      buttonStyle: `bg-[${colors.red}] hover:bg-[#c40f1a]`
    },
    {
      title: t?.pricing?.plans?.[2]?.title,
      subtitle: t?.pricing?.plans?.[2]?.subtitle,
      icon: <FaBuilding className="text-[${colors.blue}]" size={36} />,
      price: t?.pricing?.plans?.[2]?.price,
      period: t?.pricing?.plans?.[2]?.period,
      button: t?.pricing?.plans?.[2]?.button,
      features: t?.pricing?.plans?.[2]?.features,
      badge: (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[${colors.blue}] text-[${colors.white}] px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 border-2 border-[${colors.white}]/20">
          <FaRocket className="text-[${colors.yellow}]" /> {t?.pricing?.plans?.[2]?.badgeText}
        </div>
      ),
      borderColor: `border-[${colors.blue}]/30`,
      buttonStyle: `bg-[${colors.black}] hover:bg-[${colors.black}]/90`
    },
  ];

  return (
    <section 
      className="py-16" 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      style={{ backgroundColor: colors.white }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4 relative" style={{ color: colors.black }}>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(45deg, ${colors.blue}, ${colors.red})` }}>
              {t?.pricing?.title}
            </span>
            <FaCrown className="absolute -top-2 left-1/2 transform -translate-x-1/2" style={{ color: colors.yellow }} />
          </h2>
          <p className="text-xl mt-4 max-w-2xl mx-auto leading-relaxed" style={{ color: colors.gray }}>
            {t?.pricing?.subtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative group transform hover:scale-105 transition-all duration-300 rounded-xl shadow-xl overflow-hidden ${plan.borderColor}`}
              style={{ 
                borderTopWidth: '4px',
                boxShadow: `0 10px 30px ${colors.gray}20`
              }}
            >
              {plan.badge}
              
              <div className="bg-white p-8 h-full">
                <div className={`flex items-center justify-between mb-8 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className={`${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-2xl font-bold" style={{ color: colors.black }}>{plan.title}</h3>
                    <p className="mt-2" style={{ color: colors.gray }}>{plan.subtitle}</p>
                  </div>
                  <div 
                    className="p-4 rounded-full shadow-lg"
                    style={{ 
                      backgroundColor: colors.white,
                      border: `2px solid ${colors.gray}20`
                    }}
                  >
                    {plan.icon}
                  </div>
                </div>

                <div className={`mb-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className="text-3xl font-bold mb-2" style={{ color: colors.blue }}>
                    {plan.price}
                  </div>
                  <div className="font-medium" style={{ color: colors.gray }}>
                    {plan.period}
                  </div>
                </div>

                <button 
                  className={`w-full ${plan.buttonStyle} text-white py-4 px-6 rounded-lg font-semibold transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2`}
                  style={{ 
                    backgroundColor: plan.buttonStyle.includes('blue') ? colors.blue : 
                                    plan.buttonStyle.includes('red') ? colors.red : colors.black
                  }}
                >
                  <span>{plan.button}</span>
                  <FaArrowRight className={`animate-pulse group-hover:animate-none ${language === 'ar' ? 'transform rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
                </button>

                <div className="mt-8 pt-8 border-t" style={{ borderColor: colors.gray + '30' }}>
                  <h4 className={`text-lg font-semibold mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`} style={{ color: colors.black }}>
                    {t?.pricing?.featuresTitle}:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features?.map((feat, i) => (
                      <li 
                        key={i} 
                        className={`flex items-start ${language === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
                        style={{ color: colors.gray }}
                      >
                        <FaCheck className={`flex-shrink-0 ${language === 'ar' ? 'ml-3' : 'mr-3'} mt-1`} style={{ color: colors.red }} />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p 
            className="text-lg flex items-center justify-center gap-2"
            style={{ color: colors.gray }}
          >
            <span className="text-xl" style={{ color: colors.red }}>🔒</span>
            {t?.pricing?.guarantee}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;