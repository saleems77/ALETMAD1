"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiSend, FiPlus, FiPaperclip, FiSmile, FiCheck, FiCheckCircle, FiUsers } from 'react-icons/fi';
import { ImDownload } from 'react-icons/im';

const COLORS = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

const initialCourses = [
  {
    id: 1,
    name: 'دورة تطوير الويب المتقدم',
    instructor: 'محمد علي',
    participants: 23,
    unread: 2,
    active: true
  },
  {
    id: 2,
    name: 'دورة UI/UX الاحترافية',
    instructor: 'فاطمة أحمد',
    participants: 15,
    unread: 0,
    active: false
  }
];

export default function CourseChatSystem() {
  const [selectedCourse, setSelectedCourse] = useState(1);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'مرحباً بالجميع في دورة تطوير الويب!',
      sender: 'محمد علي',
      time: '10:00 ص',
      isInstructor: true,
      attachments: [],
      readBy: ['محمد علي', 'أحمد'],
      replies: []
    },
    {
      id: 2,
      text: 'شكراً أستاذ محمد، هل يمكن مشاركة المواد الدراسية؟',
      sender: 'أحمد',
      time: '10:05 ص',
      isInstructor: false,
      attachments: [],
      readBy: ['أحمد'],
      replies: [
        {
          id: 3,
          text: 'بالطبع، سأرفقها الآن',
          sender: 'محمد علي',
          time: '10:06 ص',
          isInstructor: true
        }
      ]
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() && !filePreview) return;

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'طالب',
      time: new Date().toLocaleTimeString('ar-EG', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      isInstructor: false,
      attachments: filePreview ? [filePreview] : [],
      readBy: ['طالب'],
      replies: []
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    setFilePreview(null);
  }, [newMessage, filePreview]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      file: file, // إرسال الملف مباشرة بدلًا من Base64
    }));
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAttachments] }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl flex h-[800px] font-sans">
      {/* قائمة الدورات */}
      <div className="w-1/4 border-r" style={{ backgroundColor: COLORS.white }}>
        <div className="p-4 border-b" style={{ borderColor: COLORS.gray }}>
          <h2 className="text-xl font-bold" style={{ color: COLORS.black }}>الدورات التعليمية</h2>
        </div>
        
        <div className="overflow-y-auto h-[calc(800px-80px)]">
          {initialCourses.map(course => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              className={`p-4 border-b cursor-pointer transition-all ${
                course.active ? 'border-l-4' : ''
              }`}
              style={{
                borderLeftColor: course.active ? COLORS.blue : 'transparent',
                backgroundColor: course.id === selectedCourse ? COLORS.gray + '15' : 'transparent'
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium" style={{ color: COLORS.black }}>{course.name}</h3>
                {course.unread > 0 && (
                  <span 
                    className="px-2 py-1 rounded-full text-xs"
                    style={{ backgroundColor: COLORS.red, color: COLORS.white }}
                  >
                    {course.unread}
                  </span>
                )}
              </div>
              <div className="flex items-center mt-2 text-sm" style={{ color: COLORS.gray }}>
                <FiUsers className="mr-1" />
                <span>{course.participants} مشارك</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* منطقة المحادثة الرئيسية */}
      <div className="flex-1 flex flex-col">
        {/* الهيدر */}
        <div 
          className="p-4 border-b flex items-center justify-between"
          style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray }}
        >
          <div>
            <h2 className="text-xl font-bold" style={{ color: COLORS.black }}>
              {initialCourses.find(c => c.id === selectedCourse)?.name}
            </h2>
            <div className="flex items-center mt-1" style={{ color: COLORS.gray }}>
              <FiUsers className="mr-1" />
              <span className="text-sm">
                {initialCourses.find(c => c.id === selectedCourse)?.participants} مشارك
              </span>
            </div>
          </div>
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: COLORS.blue }}
          >
            <FiPlus size={24} />
          </button>
        </div>

        {/* منطقة الرسائل */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ backgroundColor: COLORS.white }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isInstructor ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xl p-4 rounded-3xl relative ${
                  msg.isInstructor 
                    ? 'bg-gray-100' 
                    : 'ml-12'
                }`}
                style={{
                  backgroundColor: msg.isInstructor ? COLORS.gray + '15' : COLORS.blue,
                  color: msg.isInstructor ? COLORS.black : COLORS.white
                }}
              >
                {/* رأس الرسالة */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium">{msg.sender}</span>
                    {msg.isInstructor && (
                      <span 
                        className="ml-2 px-2 py-1 rounded text-xs"
                        style={{ backgroundColor: COLORS.yellow, color: COLORS.black }}
                      >
                        المدرب
                      </span>
                    )}
                  </div>
                  <span className="text-xs opacity-75">{msg.time}</span>
                </div>

                {/* محتوى الرسالة */}
                <p className="text-base leading-6">{msg.text}</p>

                {/* المرفقات */}
                {msg.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="mt-2 p-2 rounded-lg flex items-center justify-between"
                    style={{ backgroundColor: msg.isInstructor ? COLORS.white : COLORS.blue + '30' }}
                  >
                    <div className="flex items-center">
                      <FiPaperclip className="mr-2" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <ImDownload 
                      className="cursor-pointer hover:opacity-75 transition-opacity"
                      style={{ color: msg.isInstructor ? COLORS.blue : COLORS.white }}
                    />
                  </div>
                ))}

                {/* الحالة */}
                <div className="mt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    {msg.readBy.map((user, idx) => (
                      <FiCheckCircle 
                        key={idx}
                        style={{ color: COLORS.blue }}
                        className="inline-block"
                      />
                    ))}
                  </div>
                  <span>{msg.readBy.length} قراءة</span>
                </div>

                {/* الردود */}
                {msg.replies.length > 0 && (
                  <div className="mt-4 ml-4 pl-4 border-l-2" style={{ borderColor: COLORS.gray }}>
                    {msg.replies.map(reply => (
                      <div
                        key={reply.id}
                        className="mt-2 p-2 rounded-lg"
                        style={{ backgroundColor: COLORS.gray + '15' }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{reply.sender}</span>
                          <span className="text-xs opacity-75">{reply.time}</span>
                        </div>
                        <p className="text-sm">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* منطقة الإدخال */}
        <div 
          className="border-t p-4"
          style={{ borderColor: COLORS.gray, backgroundColor: COLORS.white }}
        >
          <div className="flex items-center space-x-4">
            {/* أزرار الإجراءات */}
            <label 
              className="p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              style={{ color: COLORS.blue }}
            >
              <input type="file" hidden onChange={handleFileUpload} />
              <FiPaperclip size={24} />
            </label>
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: COLORS.blue }}
            >
              <FiSmile size={24} />
            </button>

            {/* حقل الإدخال */}
            <input
              type="text"
              className="flex-1 p-4 rounded-2xl focus:outline-none transition-all 
                       placeholder-gray-400 text-base border"
              style={{
                borderColor: COLORS.gray,
                backgroundColor: COLORS.white,
                color: COLORS.black
              }}
              placeholder="اكتب رسالة..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />

            {/* معاينة الملف */}
            {filePreview && (
              <div className="flex items-center p-2 rounded-lg space-x-2" 
                style={{ backgroundColor: COLORS.gray + '15' }}>
                <span className="text-sm" style={{ color: COLORS.black }}>
                  {filePreview.name}
                </span>
                <button 
                  onClick={() => setFilePreview(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}

            {/* زر الإرسال */}
            <button
              className="p-4 rounded-2xl flex items-center space-x-2 transition-colors"
              style={{ 
                backgroundColor: COLORS.blue,
                color: COLORS.white
              }}
              onClick={sendMessage}
            >
              <span className="text-base">إرسال</span>
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}