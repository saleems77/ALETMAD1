// ChatAI.js
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, ArrowPathIcon, PlusCircleIcon, PhotoIcon, XCircleIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ChatAI = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [files, setFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // التمرير التلقائي إلى آخر رسالة
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // معالجة إرسال الرسالة
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && files.length === 0) return;

    // إنشاء رسالة المستخدم
    const newMessageObj = {
      text: newMessage,
      isUser: true,
      files: [...files],
      timestamp: new Date(),
    };

    // إضافة الرسالة إلى المحادثة فورًا
    setMessages(prev => [...prev, newMessageObj]);
    setNewMessage('');
    setIsLoading(true);

    try {
      // إرسال الطلب إلى Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBz8KBE-eVKdXAkRmEBclMJKpx5KM4Mg8c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: newMessage }],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiMessage = {
        text: data.candidates[0].content.parts[0].text,
        isUser: false,
        timestamp: new Date(),
      };

      // إضافة رد الذكاء الاصطناعي إلى المحادثة
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('فشل في إرسال الرسالة:', error);
      const errorMessage = {
        text: 'عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setFiles([]);
    }
  };

  // معالجة رفع الملفات
  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  // حذف ملف معين
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0D1012]' : 'bg-white'}`}>
      {/* رأس الدردشة */}
      <motion.header
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className={`${isDarkMode ? 'bg-[#0D1012] border-[#1A1F24]' : 'bg-white border-[#F0F2F5]'} backdrop-blur-md p-4 border-b`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-xl shadow-lg ${isDarkMode ? 'bg-[#008DCB]' : 'bg-[#008DCB]'}`}
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#0D1012]'}`}>ChatAI Assistant</h1>
              <p className={`text-sm ${isDarkMode ? 'text-[#999999]' : 'text-[#666666]'}`}>المساعد الذكي للرد على استفساراتك</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-[#1A1F24] text-[#F9D011]' : 'bg-[#F0F2F5] text-[#0D1012]'} transition-colors`}
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* حاوية الرسائل */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-[60vh] text-center"
              >
                <div className={`p-4 rounded-full ${isDarkMode ? 'bg-[#1A1F24]' : 'bg-[#F9F9F9]'} mb-6`}>
                  <div className={`p-3 rounded-full ${isDarkMode ? 'bg-[#008DCB]' : 'bg-[#008DCB]'}`}>
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
                <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-[#0D1012]'}`}>مرحباً في ChatAI Assistant</h2>
                <p className={`max-w-md ${isDarkMode ? 'text-[#999999]' : 'text-[#666666]'}`}>
                  ابدأ المحادثة بطرح سؤال أو تحميل ملف للحصول على مساعدة من الذكاء الاصطناعي
                </p>
                <div className="mt-6 flex gap-2">
                  {['مرحباً', 'كيف يمكنك مساعدتي؟', 'أخبرني عن نفسك'].map((suggestion, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewMessage(suggestion)}
                      className={`text-sm px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-[#1A1F24] text-[#999999] hover:bg-[#008DCB] hover:text-white' : 'bg-[#F0F2F5] text-[#666666] hover:bg-[#008DCB] hover:text-white'}`}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative max-w-[85%] p-4 rounded-2xl shadow-sm transition-all duration-300 ${
                    message.isUser
                      ? isDarkMode 
                        ? 'bg-gradient-to-br from-[#008DCB] to-[#0077B3] text-white rounded-tr-none'
                        : 'bg-gradient-to-br from-[#008DCB] to-[#0077B3] text-white rounded-tr-none'
                      : isDarkMode 
                        ? 'bg-[#1A1F24] text-gray-100 rounded-tl-none'
                        : 'bg-[#F9F9F9] text-[#0D1012] rounded-tl-none'
                  }`}
                >
                  {/* ملفات الرسالة */}
                  {message.files?.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {message.files.map((file, i) => (
                        <div 
                          key={i} 
                          className={`flex items-center gap-2 p-2 rounded-lg ${
                            message.isUser 
                              ? 'bg-white/20' 
                              : isDarkMode 
                                ? 'bg-[#252A30]' 
                                : 'bg-[#E6E9ED]'
                          }`}
                        >
                          <PhotoIcon className="w-5 h-5 text-[#008DCB]" />
                          <span className="text-xs truncate max-w-[120px]">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* محتوى الرسالة */}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  
                  {/* وقت الإرسال */}
                  <div className={`absolute bottom-1.5 right-2.5 text-xs ${
                    message.isUser 
                      ? 'text-white/80' 
                      : isDarkMode 
                        ? 'text-[#999999]' 
                        : 'text-[#666666]'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                  
                  {/* مؤشر المستخدم/الذكاء الاصطناعي */}
                  <div className={`absolute -top-2.5 w-6 h-6 flex items-center justify-center rounded-full ${
                    message.isUser 
                      ? isDarkMode 
                        ? 'bg-[#008DCB] -right-2.5' 
                        : 'bg-[#008DCB] -right-2.5'
                      : isDarkMode 
                        ? 'bg-[#1A1F24] -left-2.5' 
                        : 'bg-[#F9F9F9] -left-2.5'
                  }`}>
                    {message.isUser ? (
                      <span className="text-xs font-bold text-white">أنت</span>
                    ) : (
                      <span className="text-xs font-bold text-[#008DCB]">AI</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* مؤشر التحميل */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-start gap-2 pl-4"
            >
              <div className="flex space-x-1.5">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-[#008DCB]' : 'bg-[#008DCB]'}`}
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-[#008DCB]' : 'bg-[#008DCB]'}`}
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-[#008DCB]' : 'bg-[#008DCB]'}`}
                />
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-[#999999]' : 'text-[#666666]'}`}>
                جاري الإجابة...
              </span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* منطقة الإدخال */}
      <footer className={`${isDarkMode ? 'bg-[#0D1012] border-[#1A1F24]' : 'bg-white border-[#F0F2F5]'} backdrop-blur-md border-t p-4`}>
        <div className="max-w-4xl mx-auto">
          {/* معاينة الملفات المرفقة */}
          {files.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-3 flex flex-wrap gap-2"
            >
              {files.map((file, index) => (
                <motion.div 
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F4FF] text-[#008DCB] text-sm"
                >
                  <PhotoIcon className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-[#E2101E] hover:text-[#C00E1A]"
                  >
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* نموذج الإدخال */}
          <motion.form 
            onSubmit={handleSend}
            className="flex gap-3"
          >
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => fileInputRef.current.click()}
                className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-[#1A1F24] text-[#999999] hover:bg-[#008DCB] hover:text-white' : 'bg-[#F0F2F5] text-[#666666] hover:bg-[#008DCB] hover:text-white'} transition-colors`}
              >
                <PlusCircleIcon className="w-5 h-5" />
              </motion.button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
                accept="image/*, .pdf"
              />
            </div>
            <motion.div
              className="flex-1 relative"
              whileFocus={{ boxShadow: `0 0 0 2px ${isDarkMode ? '#008DCB' : '#008DCB'}` }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className={`w-full px-5 py-3.5 rounded-xl focus:outline-none transition-all shadow-sm ${
                  isDarkMode 
                    ? 'bg-[#1A1F24] text-white placeholder-[#666666]' 
                    : 'bg-[#F9F9F9] text-[#0D1012] placeholder-[#999999]'
                }`}
                disabled={isLoading}
              />
              {newMessage.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  type="button"
                  onClick={() => setNewMessage('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999] hover:text-[#E2101E]"
                >
                  <XCircleIcon className="w-5 h-5" />
                </motion.button>
              )}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || (!newMessage.trim() && files.length === 0)}
              className={`p-3.5 rounded-xl shadow-lg transition-all ${
                (isLoading || (!newMessage.trim() && files.length === 0))
                  ? 'bg-[#999999] text-white cursor-not-allowed'
                  : isDarkMode 
                    ? 'bg-gradient-to-br from-[#008DCB] to-[#0077B3] text-white hover:from-[#0077B3] hover:to-[#006699]' 
                    : 'bg-gradient-to-br from-[#008DCB] to-[#0077B3] text-white hover:from-[#0077B3] hover:to-[#006699]'
              }`}
            >
              {isLoading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="w-5 h-5 transform rotate-90" />
              )}
            </motion.button>
          </motion.form>
          
          {/* تذييل صغير */}
          <p className={`text-center mt-3 text-xs ${isDarkMode ? 'text-[#999999]' : 'text-[#666666]'}`}>
            ChatAI Assistant · الذكاء الاصطناعي المتقدم للرد على استفساراتك
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChatAI;