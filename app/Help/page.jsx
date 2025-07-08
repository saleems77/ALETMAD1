"use client"
import React, { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '../DashBoardAdmin/components/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

const HelpPage = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const messagesEndRef = useRef(null);

  // جلب الرسائل السابقة للمستخدم
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/support-tickets?filters[users_permissions_user][id][$eq]=${user.id}&sort=createdAt:desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setTickets(data.data);
    } catch (error) {
      toast.error('فشل تحميل الرسائل.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // جلب التذاكر عند تحميل الصفحة فقط
  useEffect(() => {
    if (user?.documentId && token) {
      fetchTickets();
    }
  }, [user?.documentId, token]); // سيتم التنفيذ مرة واحدة فقط عند تحميل الصفحة

  // التمرير إلى آخر رسالة عند تحديث التذاكر
  useEffect(() => {
    scrollToBottom();
  }, [tickets]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  // إرسال رسالة جديدة
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('يرجى إدخال رسالة قبل الإرسال.');
      return;
    }

    try {
      setSending(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/support-tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            content: message,
            users_permissions_user: {
              connect: [user.documentId],
            },
          },
        }),
      });

      if (!response.ok) throw new Error('فشل إرسال الرسالة.');

      toast.success('تم إرسال الرسالة بنجاح!');
      setMessage('');
      await fetchTickets(); // تحديث قائمة الرسائل بعد الإرسال
    } catch (error) {
      toast.error(`حدث خطأ: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  // تحديث التذاكر يدويًا
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTickets();
    toast.success('تم تحديث المحادثة');
  };

  // تحويل التاريخ إلى صيغة مقروءة
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };


  return (
    <ProtectedRoute>
      <Toaster />
      <div className="relative min-h-screen overflow-hidden bg-gray-50">
        {/* شريط العنوان العلوي */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-6 px-8 shadow-lg">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              مركز المساعدة
            </h1>
            <p className="mt-1 opacity-90">نسعى لراحتكم دائماً</p>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* معلومات المساعدة */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-1 h-fit">
              <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                نصائح سريعة
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">صف مشكلتك بوضوح ودقة</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">أرفق صوراً للمشكلة إن أمكن</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-700">تفقد البريد الإلكتروني بانتظام للاطلاع على الردود</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <span className="font-bold">مهم!</span> سيتم الرد على استفساراتك خلال 24 ساعة كحد أقصى
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* محادثة المساعدة */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* رأس المحادثة */}
                <div className="bg-blue-600 px-6 py-4">
                  <div className="flex items-center">
                    <div className="bg-white rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-white">محادثة الدعم الفني</h3>
                      <p className="text-blue-200 text-sm">فريق الدعم جاهز لمساعدتك</p>
                    </div>
                  </div>
                </div>

                {/* منطقة الرسائل */}
                <div className="p-4 h-[500px] overflow-y-auto bg-gray-50">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-700">لا توجد رسائل سابقة</h3>
                      <p className="text-gray-500 mt-2">ابدأ محادثة جديدة مع فريق الدعم لحل مشكلتك</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {tickets.map((ticket) => (
                        <div key={ticket.id} className="space-y-4">
                          {/* رسالة المستخدم */}
                          <div className="flex justify-end">
                            <div className="max-w-[80%]">
                              <div className="bg-blue-600 text-black rounded-l-2xl rounded-tr-2xl p-4">
                                <p>{ticket.content}</p>
                              </div>
                              <div className="text-xs text-gray-500 mt-1 text-right">
                                {formatDate(ticket.createdAt)}
                              </div>
                            </div>
                          </div>

                          {/* حالة التذكرة */}
                          <div className="flex justify-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              ticket.statu === 'تم الرد' ? 'bg-green-100 text-green-800' : 
                              ticket.statu === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {ticket.statu}
                            </span>
                          </div>

                          {/* رد المسؤول */}
                          {ticket.adminReply && (
                            <div className="flex justify-start">
                              <div className="max-w-[80%]">
                                <div className="bg-gray-200 text-gray-800 rounded-r-2xl rounded-tl-2xl p-4">
                                  <div className="flex items-center mb-1">
                                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    <span className="text-sm font-medium text-blue-700">الدعم الفني</span>
                                  </div>
                                  <p>{ticket.adminReply}</p>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {ticket.updatedAt ? formatDate(ticket.updatedAt) : formatDate(ticket.attributes.createdAt)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* نموذج الإرسال */}
                <div className="border-t border-gray-200 p-4 bg-white">
                  <form onSubmit={handleSubmit} className="flex items-start">
                    <div className="flex-grow mr-3">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        rows={2}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className={`px-5 py-3 rounded-lg font-medium flex items-center transition ${
                        sending 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {sending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                          إرسال
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الشريط السفلي */}
        <div className="bg-black py-4 text-white text-center">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center justify-center mb-2 md:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <span>خدمة العملاء متاحة 24 ساعة طوال أيام الأسبوع</span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-yellow-400 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-yellow-400 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-yellow-400 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HelpPage;