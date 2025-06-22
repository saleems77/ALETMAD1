'use client';
import React, { useState, useEffect } from 'react';
import { FiBell, FiCheckCircle, FiClock, FiX, FiAlertCircle, FiInfo, FiCheck, FiChevronDown, FiChevronUp, FiStar } from 'react-icons/fi';
import ProtectedRoute from '../DashBoardAdmin/components/ProtectedRoute';
import qs from 'qs';

const Page = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null); // حالة جديدة لتخزين بيانات المستخدم
  
  // الألوان المستخدمة في التصميم
  const colors = {
    blue: '#008DCB',
    black: '#0D1012',
    gray: '#999999',
    red: '#E2101E',
    white: '#FFFFFF',
    yellow: '#F9D011'
  };

  // جلب بيانات المستخدم من localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // إشعار ترحيبي ثابت مع اسم المستخدم
  const welcomeNotification = {
    id: 'welcome-notification',
    static: true,
    title: `مرحبًا ${currentUser?.username || 'عزيزي المستخدم'} في مركز الإشعارات`,
    message: 'مرحبا بكم في منصة الاعتماد العربي ',
    type: 'welcome',
    createdAt: new Date().toISOString(),
    read: false
  };

  // جلب الإشعارات من Strapi
  const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('user')); // الحصول على معلومات المستخدم
    
    if (!token || !user?.documentId) {
      throw new Error('يرجى تسجيل الدخول لعرض إشعاراتك');
    }

    const currentUserId = user.documentId; // استخدام documentId

    const query = qs.stringify({
      filters: {
        users_permissions_users: {
          documentId: { $eq: currentUserId } // الفلترة باستخدام documentId
        }
      },
      fields: ['message', 'type', 'createdAt'] // اختيار الحقول المطلوبة
    }, { encodeValuesOnly: true });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/notifications?${query}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) throw new Error('فشل جلب البيانات');
    
    const { data } = await response.json();
    setNotifications(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};  

  // تحديث حالة القراءة
  const markAsRead = async (documentId) => {
    try {
      const token = localStorage.getItem('jwt');
      await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/notifications/${documentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            data: { read: true }
          })
        }
      );
      
      // تحديث الحالة المحلية
      setNotifications(prev => prev.map(notif => 
        notif.documentId === documentId 
          ? { ...notif, read: true } 
          : notif
      ));
      
      // تحديث عدد الإشعارات غير المقروءة
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error('فشل التحديث:', err);
    }
  };

  // وضع علامة مقروءة على الكل
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const unreadIds = notifications
        .filter(notif => !notif.read)
        .map(notif => notif.documentId);
      
      if (unreadIds.length === 0) return;
      
      // إرسال طلبات التحديث لجميع الإشعارات غير المقروءة
      await Promise.all(unreadIds.map(id => 
        fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/notifications/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ data: { read: true } })
        })
      ));
      
      // تحديث الحالة المحلية
      setNotifications(prev => prev.map(notif => 
        !notif.read ? { ...notif, read: true } : notif
      ));
      
      setUnreadCount(0);
    } catch (err) {
      console.error('فشل تحديث جميع الإشعارات:', err);
    }
  };

  // حساب الوقت المنقضي
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (minutes < 1440) return `منذ ${Math.floor(minutes/60)} ساعة`;
    return `منذ ${Math.floor(minutes/1440)} يوم`;
  };

  // تغيير الفلتر
  const changeFilter = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredNotifications(notifications);
    } else if (filter === 'unread') {
      setFilteredNotifications(notifications.filter(notif => !notif.read));
    }
  };

  // تبديل التفاصيل
  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // جلب البيانات عند التحميل
  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    setFilteredNotifications(notifications);
  }, [notifications]);

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
        <FiAlertCircle className="text-3xl" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">حدث خطأ</h3>
      <p className="text-gray-600 max-w-md mx-auto">{error}</p>
      <button 
        onClick={fetchNotifications}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        إعادة المحاولة
      </button>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="font-sans min-h-screen bg-gray-50" dir="rtl" style={{ backgroundColor: colors.white }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FiBell className="text-2xl" style={{ color: colors.blue }} />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold" style={{ color: colors.black }}>الإشعارات</h1>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  unreadCount === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
                style={{ backgroundColor: unreadCount > 0 ? colors.blue + '20' : '', color: unreadCount > 0 ? colors.blue : '' }}
              >
                <FiCheck className="text-base" />
                تعيين الكل كمقروء
              </button>
              
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => changeFilter('all')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeFilter === 'all' 
                      ? 'text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  style={{ backgroundColor: activeFilter === 'all' ? colors.blue : '' }}
                >
                  الكل
                </button>
                <button 
                  onClick={() => changeFilter('unread')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeFilter === 'unread' 
                      ? 'text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  style={{ backgroundColor: activeFilter === 'unread' ? colors.blue : '' }}
                >
                  غير مقروء
                </button>
              </div>
            </div>
          </header>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* إشعار ترحيبي ثابت في الأعلى مع اسم المستخدم */}
            <div
              className="p-5 border-b border-gray-100 relative"
              style={{ backgroundColor: colors.blue + '08' }}
            >
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-full" style={{ backgroundColor: colors.blue + '20' }}>
                  <FiStar className="text-xl" style={{ color: colors.blue }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-md font-medium" style={{ color: colors.black }}>
                    {welcomeNotification.title}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: colors.black }}>
                    {welcomeNotification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs px-2 py-1 rounded-full" 
                      style={{ 
                        backgroundColor: colors.yellow + '20', 
                        color: colors.yellow + 'd0' 
                      }}>
                      إشعار ترحيبي
                    </span>
                    <span className="text-xs" style={{ color: colors.gray }}>
                      {getTimeAgo(welcomeNotification.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute top-3 left-3 flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: colors.blue + '20' }}>
                <FiInfo className="text-xs" style={{ color: colors.blue }} />
              </div>
            </div>

            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <FiCheckCircle className="text-4xl mx-auto mb-3" style={{ color: colors.gray }} />
                <h3 className="text-lg font-medium mb-1" style={{ color: colors.black }}>لا توجد إشعارات</h3>
                <p className="text-gray-500">
                  {activeFilter === 'unread' 
                    ? 'لا توجد إشعارات غير مقروءة' 
                    : 'لم يتم العثور على أي إشعارات'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {filteredNotifications.map((notification) => {
                  const { id, documentId, message, type, read, createdAt, title } = notification;
                  const isExpanded = expandedId === id;
                  
                  // تحديد الأيقونة واللون حسب نوع الإشعار
                  let icon, iconColor, bgColor;
                  switch (type) {
                    case 'reminder':
                      icon = <FiClock />;
                      iconColor = colors.blue;
                      bgColor = colors.blue + '10';
                      break;
                    case 'alert':
                      icon = <FiAlertCircle />;
                      iconColor = colors.red;
                      bgColor = colors.red + '10';
                      break;
                    default:
                      icon = <FiBell />;
                      iconColor = colors.yellow;
                      bgColor = colors.yellow + '10';
                  }
                  
                  return (
                    <div
                      key={id}
                      className={`p-4 transition-colors group ${
                        !read ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      style={{ backgroundColor: !read ? bgColor : '' }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full" style={{ backgroundColor: read ? colors.gray + '20' : bgColor }}>
                          {React.cloneElement(icon, { 
                            className: "text-lg", 
                            style: { color: read ? colors.gray : iconColor } 
                          })}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className={`text-md font-medium ${
                              read ? 'text-gray-600' : 'text-gray-800'
                            }`} style={{ color: read ? colors.gray : colors.black }}>
                              {title || (type === 'reminder' ? 'تذكير' : type === 'alert' ? 'تحذير' : 'إشعار')}
                            </h3>
                            <button 
                              onClick={() => toggleDetails(id)}
                              className="text-gray-400 hover:text-blue-500 ml-2"
                              style={{ color: colors.gray }}
                            >
                              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                          </div>
                          
                          <p className={`text-sm mt-1 ${
                            read ? 'text-gray-500' : 'text-gray-700'
                          }`} style={{ color: read ? colors.gray : colors.black }}>
                            {message}
                          </p>
                          
                          {isExpanded && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <p className="text-xs text-gray-500" style={{ color: colors.gray }}>
                                {new Date(createdAt).toLocaleString('ar-SA', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs" style={{ color: colors.gray }}>
                                {getTimeAgo(createdAt)}
                              </span>
                              {!read && (
                                <span className="text-xs px-2 py-1 rounded-full" 
                                  style={{ 
                                    backgroundColor: colors.yellow + '20', 
                                    color: colors.yellow + 'd0' 
                                  }}>
                                  جديد
                                </span>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              {!read && (
                                <button 
                                  onClick={() => markAsRead(documentId)}
                                  className="text-xs px-3 py-1 text-white rounded-lg hover:opacity-90 transition-opacity"
                                  style={{ backgroundColor: colors.blue }}
                                >
                                  وضع علامة مقروء
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="mt-6 text-center text-sm" style={{ color: colors.gray }}>
            عرض {filteredNotifications.length} من أصل {notifications.length} إشعار
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;