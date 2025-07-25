"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiSend, FiUsers, FiPaperclip, FiCheckCircle, FiX } from 'react-icons/fi';
import { ImDownload } from 'react-icons/im';
import ProtectedRoute from '../DashBoardAdmin/components/ProtectedRoute';
import { useSelector } from 'react-redux';
import qs from 'qs';
import { createStrapiData } from '../../lib/strapi';

const COLORS = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

export default function CourseChatSystem() {
  const { user } = useSelector((state) => state.auth);
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [userRole, setUserRole] = useState('student');
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [currentChatRelationId, setCurrentChatRelationId] = useState(null);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (user) {
      const isInstructor = user.role?.name === 'instructor' || 
                          user.permissions?.includes('manage-courses');
      setUserRole(isInstructor ? 'instructor' : 'student');
      fetchUserCourses();
    }
  }, [user]);

  const fetchUserCourses = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token || !user || !user.id) {
        console.error('التوكن أو معرف المستخدم غير متوفر');
        setIsLoading(false);
        return;
      }

      const query = qs.stringify({
        filters: {
          users_permissions_user: {
            id: {
              $eq: user.id
            }
          }
        },
        populate: {
          users_permissions_user: {
            fields: ['username']
          },
          participants: {
            fields: ['id']
          },

        }
      }, { encodeValuesOnly: true });

      const response = await fetch(`${API_URL}/courses?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('فشل جلب الدورات');

      const data = await response.json();
      
      const formattedCourses = data.data.map(course => ({
        documentId: course.documentId,
        id: course.id,
        name: course.courseName,
        instructor: course.users_permissions_user?.username || 'مدرب غير معروف',
        participants: course.participants?.data?.length || 0,
        unread: 0,
        active: course.reviewStatus === 'Approved',
        chatDocumentId: course.course_chats?.data?.[0]?.documentId || null
      }));

      setCourses(formattedCourses);
      setIsLoading(false);
      
    } catch (error) {
      console.error('خطأ في جلب الدورات:', error);
      setIsLoading(false);
    }
  };

 const fetchCourseMessages = async (chatDocumentId) => {
  if (!chatDocumentId) {
    setMessages([]);
    return;
  }

  try {
    setIsLoadingMessages(true);
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error('Token not found');

    const query = qs.stringify({
      filters: {
        documentId: {
          $eq: chatDocumentId
        }
      },
      populate: {
        messages: {
          populate: {
            users_permissions_user: {
              fields: ['username']
            },
            attachments: true
          }
        }
      }
    }, { encodeValuesOnly: true });

    const response = await fetch(
      `${API_URL}/course-chats?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('فشل جلب الرسائل:', response.status, errorData);
      throw new Error(`فشل جلب الرسائل: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const chatData = data.data[0];

    if (!chatData || !chatData.messages || chatData.messages.length === 0) {
      setMessages([]);
      return;
    }

    const processedMessages = chatData.messages.map(msg => ({
      id: msg.id,
      documentId: msg.documentId,
      text: msg.text || 'رسالة فارغة',
      sender: msg.users_permissions_user?.username || 'مستخدم مجهول',
      time: msg.timestamp 
        ? new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit', hour12: true }) 
        : new Date(msg.publishedAt).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit', hour12: true }),
      isInstructor: msg.isInstructor,
      attachments: msg.attachments?.data || [],
      readBy: msg.readBy || [],
    }));

    setMessages(processedMessages);
  } catch (error) {
    console.error('خطأ في جلب الرسائل:', error);
    setMessages([]);
  } finally {
    setIsLoadingMessages(false);
  }
};

  const handleSelectCourse = async (course) => {
     setCurrentChatId(null);
  setMessages([]);

  setSelectedCourse(course.documentId);

  try {
    const token = localStorage.getItem("jwt");
    if (!token || !course.id) {
      console.error('التوكن أو معرف الدورة غير متوفر');
      return;
    }

    const chatQuery = qs.stringify({
      filters: {
        course: {
          documentId: {
            $eq: course.documentId
          }
        }
      },
      populate: {
        messages: true
      }
    }, { encodeValuesOnly: true });

    const chatResponse = await fetch(`${API_URL}/course-chats?${chatQuery}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!chatResponse.ok) {
      throw new Error('فشل في جلب المحادثة من قاعدة البيانات');
    }

    const chatData = await chatResponse.json();

    if (chatData.data.length > 0) {
      const existingChat = chatData.data[0];
      setCurrentChatId(existingChat.documentId);
        setCurrentChatRelationId(existingChat.id);
      fetchCourseMessages(existingChat.documentId);
    } else {
      const createChatResponse = await fetch(`${API_URL}/course-chats`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            title: `محادثة دورة ${course.name}`,
            course: course.id,
            users_permissions_users: [user.id]
          }
        })
      });

      if (!createChatResponse.ok) {
        throw new Error('فشل في إنشاء المحادثة');
      }

      const newChatData = await createChatResponse.json();
      const newChatDocumentId = newChatData.data.documentId;

      setCourses(prev => prev.map(c => 
        c.documentId === course.documentId ? { 
          ...c, 
          chatDocumentId: newChatDocumentId 
        } : c
      ));

      setCurrentChatId(newChatDocumentId);
      if (course.chatDocumentId) {
    setCurrentChatRelationId(chatData.data[0]?.id);
  }
    }
  } catch (error) {
    console.error('خطأ في معالجة المحادثة:', error);
    alert(`حدث خطأ: ${error.message}`);
  }
};

const sendMessage = async () => {
  if ((!newMessage.trim() && !filePreview) || !currentChatId || !currentChatRelationId) return;

  try {
    setIsSending(true);

    const messageData = {
      text: newMessage,
      timestamp: new Date().toISOString(),
      isInstructor: userRole === 'instructor',
      course_chat: currentChatRelationId,
      users_permissions_user: user.id
    };

    const response = await createStrapiData('/messages', { data: messageData });

    if (filePreview) {
      const formData = new FormData();
      formData.append('files', filePreview.file);
      formData.append('ref', 'api::message.message');
      formData.append('refId', response.data.id);
      formData.append('field', 'attachments');

      const uploadResponse = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        console.error('فشل تحميل المرفق');
      }
    }

    const newMsg = {
      id: response.data.id,
      text: response.data.text,
      sender: user.username,
      time: new Date().toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit', hour12: true }),
      isInstructor: userRole === 'instructor',
      attachments: filePreview ? [filePreview] : [],
      readBy: [user.username],
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    setFilePreview(null);

  } catch (error) {
    console.error('فشل إرسال الرسالة:', error);
    alert(`خطأ في الإرسال: ${error.message}`);
  } finally {
    setIsSending(false);
  }
};

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFilePreview({
      name: file.name,
      file: file,
      url: URL.createObjectURL(file)
    });
  };

  return (
    <ProtectedRoute>
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl flex flex-col md:flex-row h-[90vh] min-h-[700px] max-h-[900px] font-sans overflow-hidden">
        {/* قائمة الدورات */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r flex flex-col" style={{ backgroundColor: COLORS.white }}>
          <div className="p-4 border-b" style={{ borderColor: COLORS.gray, backgroundColor: COLORS.white }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold" style={{ color: COLORS.black }}>
                  {userRole === 'instructor' ? 'دوراتك التعليمية' : 'الدورات المسجل فيها'}
                </h1>
                <p className="text-xs mt-1" style={{ color: COLORS.gray }}>
                  {userRole === 'instructor' 
                    ? 'جميع الدورات التي قمت بإنشائها' 
                    : 'الدورات التي سجلت فيها'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.blue + '20' }}>
                <FiUsers className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-4 border-b animate-pulse">
                  <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))
            ) : courses.length === 0 ? (
              <div className="p-4 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                <FiUsers className="text-4xl mb-3" style={{ color: COLORS.gray }} />
                <p className="mb-1">
                  {userRole === 'instructor' 
                    ? 'لم تقم بإنشاء أي دورات بعد' 
                    : 'لم تسجل في أي دورات بعد'}
                </p>
                <p className="text-xs">ابدأ بإنشاء دورة جديدة أو سجل في دورة</p>
              </div>
            ) : (
              courses.map(course => (
                <div
                  key={course.documentId}
                  onClick={() => handleSelectCourse(course)}
                  className={`p-4 border-b cursor-pointer transition-all group relative overflow-hidden
                    ${course.active ? 'border-l-4' : 'opacity-80'} 
                    ${selectedCourse === course.documentId ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  style={{
                    borderLeftColor: course.active ? COLORS.blue : 'transparent',
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base truncate max-w-[70%]" style={{ color: COLORS.black }}>
                      {course.name}
                    </h3>
                    {course.unread > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform transition-transform group-hover:scale-110">
                        {course.unread}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-2 text-sm" style={{ color: COLORS.gray }}>
                    <FiUsers className="mr-1 text-sm" />
                    <span>{course.participants} مشارك</span>
                  </div>
                  
                  <div className="mt-1 text-xs truncate" style={{ color: COLORS.gray }}>
                    المدرب: {course.instructor}
                  </div>
                  
                  <div className="mt-2 text-xs flex items-center">
                    {course.active ? (
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span style={{ color: COLORS.blue }}>الدورة نشطة</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                        <span style={{ color: COLORS.gray }}>الدورة غير نشطة</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute top-0 right-0 w-1 h-full bg-transparent group-hover:bg-blue-200 transition-colors"></div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t flex items-center" style={{ borderColor: COLORS.gray }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: COLORS.blue, color: COLORS.white }}>
              {user?.username?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: COLORS.black }}>{user?.username || 'مستخدم'}</p>
              <p className="text-xs" style={{ color: COLORS.gray }}>{userRole === 'instructor' ? 'مدرب' : 'طالب'}</p>
            </div>
          </div>
        </div>
        
        {/* منطقة المحادثة */}
        <div className="flex-1 flex flex-col border-t md:border-t-0">
          {selectedCourse ? (
            <>
              <div className="p-4 border-b flex items-center justify-between" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray }}>
                <div>
                  <h2 className="text-xl font-bold truncate max-w-[70%] md:max-w-[300px]" style={{ color: COLORS.black }}>
                    {courses.find(c => c.documentId === selectedCourse)?.name || 'دورة غير معروفة'}
                  </h2>
                  <div className="flex items-center mt-1 text-sm" style={{ color: COLORS.gray }}>
                    <FiUsers className="mr-1 text-sm" />
                    <span>
                      {courses.find(c => c.documentId === selectedCourse)?.participants || 0} مشارك
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs" style={{ color: COLORS.gray }}>متصل</span>
                </div>
              </div>
              
              {/* منطقة الرسائل */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50" style={{ backgroundColor: COLORS.white + 'f0' }}>
                {isLoadingMessages ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4" style={{ 
                      borderTopColor: COLORS.blue,
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <p className="text-gray-500">جاري تحميل الرسائل...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                      <FiSend className="text-2xl" style={{ color: COLORS.blue }} />
                    </div>
                    <h3 className="text-lg font-medium mb-2" style={{ color: COLORS.black }}>ابدأ المحادثة</h3>
                    <p className="text-sm max-w-md" style={{ color: COLORS.gray }}>
                      لا توجد رسائل بعد. كن أول من يبدأ المحادثة في هذه الدورة!
                    </p>
                    <button 
                      className="mt-4 px-4 py-2 rounded-full flex items-center text-sm"
                      style={{ backgroundColor: COLORS.blue, color: COLORS.white }}
                      onClick={() => document.getElementById('messageInput')?.focus()}
                    >
                      اكتب رسالة
                    </button>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isInstructor ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xl p-4 rounded-3xl relative transition-all duration-300 transform hover:scale-[1.02] ${
                          msg.isInstructor 
                            ? 'bg-gray-100 text-black rounded-tl-none' 
                            : 'bg-blue-500 text-white rounded-tr-none'
                        }`}
                        style={{
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-medium" style={{ color: msg.isInstructor ? COLORS.black : COLORS.black }}>
                              {msg.sender}
                            </span>
                            {msg.isInstructor && (
                              <span className="ml-2 px-2 py-1 rounded text-xs bg-yellow-100" style={{ color: COLORS.black }}>
                                المدرب
                              </span>
                            )}
                          </div>
                          <span 
                            className="text-xs" 
                            style={{ 
                              color: msg.isInstructor ? COLORS.black : 'black',
                              fontWeight: 500
                            }}
                          >
                            {msg.time}
                          </span>
                        </div>
                        
                        <p 
                          className="text-base leading-6"
                          style={{ color: msg.isInstructor ? COLORS.black : COLORS.black }}
                        >
                          {msg.text}
                        </p>
                        
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-3">
                            {msg.attachments.map((file, idx) => (
                              <a
                                key={idx}
                                href={`${API_URL}${file.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`mt-2 p-3 rounded-lg flex items-center justify-between transition-all hover:opacity-90 ${
                                  msg.isInstructor 
                                    ? 'bg-white text-black' 
                                    : 'bg-blue-600 text-black'
                                }`}
                              >
                                <div className="flex items-center truncate">
                                  <FiPaperclip className="mr-2 flex-shrink-0" />
                                  <span className="text-sm truncate">{file.name}</span>
                                </div>
                                <ImDownload className="cursor-pointer flex-shrink-0 ml-2 hover:opacity-75 transition-opacity" />
                              </a>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <FiCheckCircle 
                              className="inline-block"
                              style={{ color: msg.isInstructor ? COLORS.blue : COLORS.yellow }}
                            />
                            <span 
                              style={{ 
                                color: msg.isInstructor ? COLORS.gray : 'rgba(255, 255, 255, 0.85)',
                                fontWeight: 500
                              }}
                            >
                              {msg.readBy.length} قراءة
                            </span>
                          </div>
                        </div>
                        
                        <div 
                          className={`absolute top-0 w-3 h-3 overflow-hidden ${
                            msg.isInstructor 
                              ? '-left-3' 
                              : '-right-3'
                          }`}
                        >
                          <div 
                            className={`w-3 h-3 transform rotate-45 ${
                              msg.isInstructor 
                                ? 'bg-gray-100' 
                                : 'bg-blue-500'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* منطقة الإدخال */}
              <div className="border-t p-4" style={{ borderColor: COLORS.gray, backgroundColor: COLORS.white }}>
                {filePreview && (
                  <div className="mb-3 flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <div className="flex items-center truncate">
                      <FiPaperclip className="mr-2 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-blue-800 truncate">{filePreview.name}</span>
                    </div>
                    <button 
                      onClick={() => setFilePreview(null)}
                      className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                      disabled={isSending}
                    >
                      <FiX />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <label 
                    className={`p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center ${
                      isSending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                    }`}
                    style={{ color: COLORS.blue }}
                  >
                    <input 
                      type="file" 
                      hidden 
                      onChange={handleFileUpload} 
                      disabled={isSending}
                    />
                    <FiPaperclip size={20} />
                  </label>
                  
                  <div className="flex-1 relative">
                    <input
                      id="messageInput"
                      type="text"
                      className="w-full p-3 pr-12 rounded-2xl focus:outline-none transition-all 
                               placeholder-gray-400 text-base border"
                      style={{
                        borderColor: COLORS.gray,
                        backgroundColor: COLORS.white,
                        color: COLORS.black
                      }}
                      placeholder="اكتب رسالة..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !isSending && sendMessage()}
                      disabled={isSending}
                    />
                    {newMessage && (
                      <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setNewMessage('')}
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                  
                  <button
                    className={`p-3 rounded-full flex items-center justify-center transition-all ${
                      (isSending || (!newMessage.trim() && !filePreview)) 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-blue-600'
                    }`}
                    style={{ 
                      backgroundColor: COLORS.blue,
                      color: COLORS.white,
                      minWidth: '50px'
                    }}
                    onClick={sendMessage}
                    disabled={isSending || (!newMessage.trim() && !filePreview)}
                  >
                    {isSending ? (
                      <div className="loader h-5 w-5 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiSend size={20} />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                  <FiUsers className="text-3xl" style={{ color: COLORS.blue }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: COLORS.black }}>مرحبًا في محادثات الدورة</h3>
                <p className="text-gray-600 mb-5">
                  {userRole === 'instructor'
                    ? 'اختر دورة من القائمة لبدء المحادثة مع الطلاب'
                    : 'اختر دورة لبدء المحادثة مع المدرب والطلاب'}
                </p>
                <div className="flex justify-center">
                  <div className="w-12 h-1 rounded-full" style={{ backgroundColor: COLORS.blue }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
     
    </ProtectedRoute>
  );
}