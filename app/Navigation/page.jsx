'use client';
import React from 'react';
import notificationsData from '../../notifications.json';
import { FiBell, FiCheckCircle, FiClock } from 'react-icons/fi';

const Page = () => {
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (minutes < 1440) return `منذ ${Math.floor(minutes/60)} ساعة`;
    return `منذ ${Math.floor(minutes/1440)} يوم`;
  };

  return (
    <div className="font-sans" dir="rtl">
      <header className="flex items-center gap-3 mb-6">
        <FiBell className="text-2xl text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-800">الإشعارات</h1>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {notificationsData.length === 0 ? (
          <div className="p-8 text-center">
            <FiCheckCircle className="text-4xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">لا توجد إشعارات جديدة</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notificationsData.map((notification) => (
              <div
                key={notification.id}
                className="p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    notification.read ? 'bg-gray-100' : 'bg-purple-100'
                  }`}>
                    {notification.type === 'reminder' ? (
                      <FiClock className={`text-lg ${
                        notification.read ? 'text-gray-500' : 'text-purple-600'
                      }`} />
                    ) : (
                      <FiBell className={`text-lg ${
                        notification.read ? 'text-gray-500' : 'text-purple-600'
                      }`} />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className={`text-md ${
                      notification.read ? 'text-gray-600' : 'font-medium text-gray-800'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">
                        {getTimeAgo(notification.timestamp)}
                      </span>
                      {!notification.read && (
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                          جديد
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-purple-600">
                    <FiCheckCircle className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;