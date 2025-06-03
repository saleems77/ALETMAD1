import React from 'react';

const page = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* طبقة الصورة الخلفية */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1726797757852-d718e284b86d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b25saW5lLWNvdXJzZXMtU3VwcG9ydCUyMCUyMGhlaXB8ZW58MHx8MHx8fDA%3D)', // رابط خارجي
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* طبقة التعتيم */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* النص في الزاوية العلوية اليسرى */}
        <div className="absolute top-8 left-8 text-white">
          <h2 className="text-3xl font-bold drop-shadow-lg">مركز المساعدة</h2>
          <p className="text-lg mt-2 opacity-90">نسعى لراحتكم دائماً</p>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 transform hover:scale-[1.01] transition-transform">
          {/* العنوان الرئيسي */}
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
            كيف يمكننا مساعدتك اليوم؟
          </h1>

          {/* خيارات الدعم */}
          <div className="space-y-6">
            {/* خيار البحث عن الحلول */}
            <div className="group flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 transition-all cursor-pointer border-2 border-transparent hover:border-blue-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">البحث عن الحلول</h3>
                <p className="text-gray-600 mt-2">استكشف المقالات والدروس التعليمية</p>
              </div>
              <svg 
                className="w-12 h-12 text-blue-500 group-hover:animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>

            {/* خيار الدردشة المباشرة */}
            <div className="group flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl hover:from-green-100 transition-all cursor-pointer border-2 border-transparent hover:border-green-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">كافي - الدردشة المباشرة</h3>
                <p className="text-gray-600 mt-2">تواصل مع فريق الدعم الفوري</p>
              </div>
              <svg 
                className="w-12 h-12 text-green-500 group-hover:animate-pulse" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>

          {/* معلومات الاتصال في الأسفل */}
          <div className="mt-12 text-center text-gray-600">
            <p>الاتصال على: <span className="font-semibold">920033445</span></p>
            <p className="mt-2">البريد الإلكتروني: <span className="font-semibold">support@domain.com</span></p>
          </div>
        </div>
      </div>

      {/* الشريط السفلي */}
      <div className="absolute bottom-0 w-full bg-black/70 text-white py-4 text-center">
        <p>خدمة العملاء متاحة 24 ساعة طوال أيام الأسبوع</p>
      </div>
    </div>
  );
};

export default page;