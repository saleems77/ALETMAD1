"use client"
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, ArrowPathIcon, PlusCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';

const ChatAI = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [files, setFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const simulateAIResponse = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const aiMessage = { 
        text: "هذا رد تجريبي من الذكاء الاصطناعي. يمكنك إضافة اتصال API هنا.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && files.length === 0) return;

    const newMessageObj = {
      text: newMessage,
      isUser: true,
      files: [...files],
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessageObj]);
    setNewMessage('');
    setFiles([]);
    
    simulateAIResponse();
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      {/* Chat Header */}
      <motion.header
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className={`${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-md shadow-sm p-4 border-b`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-blue-600 to-indigo-600'}`}>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>ChatAI Assistant</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>المساعد الذكي للرد على استفساراتك</p>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} hover:opacity-80 transition-opacity`}
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </motion.header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative max-w-md p-4 rounded-2xl shadow-sm ${
                    message.isUser
                      ? isDarkMode 
                        ? 'bg-gradient-to-br from-gray-700 to-gray-600 text-gray-100'
                        : 'bg-gradient-to-br from-blue-600 to-blue-500 text-white'
                      : isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-gray-100'
                        : 'bg-white border border-gray-100/80 shadow-md'
                  }`}
                >
                  {/* Message Files */}
                  {message.files?.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {message.files.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                          <PhotoIcon className="w-5 h-5 text-blue-300" />
                          <span className="text-xs truncate">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Message Content */}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  
                  {/* Message Timestamp */}
                  <div className={`absolute bottom-1.5 right-2.5 text-xs ${
                    message.isUser 
                      ? isDarkMode ? 'text-gray-400' : 'text-blue-100'
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-start gap-2 pl-4"
            >
              <div className="flex space-x-1.5">
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isDarkMode ? 'bg-blue-300' : 'bg-blue-500'}`} />
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse delay-100 ${isDarkMode ? 'bg-blue-300' : 'bg-blue-500'}`} />
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse delay-200 ${isDarkMode ? 'bg-blue-300' : 'bg-blue-500'}`} />
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className={`${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-md border-t p-4`}>
        <div className="max-w-4xl mx-auto">
          {/* Uploaded Files Preview */}
          {files.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 text-blue-800 text-sm">
                  <PhotoIcon className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <motion.form 
            onSubmit={handleSend}
            className="flex gap-3"
          >
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} hover:opacity-80 transition-opacity`}
              >
                <PlusCircleIcon className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
                accept="image/*, .pdf"
              />
            </div>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className={`flex-1 px-5 py-3.5 rounded-xl focus:outline-none transition-all shadow-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-400' 
                  : 'border border-gray-200 placeholder-gray-400 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className={`p-3.5 rounded-xl shadow-lg transition-all ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-700 to-indigo-700 text-gray-100' 
                  : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
              } hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="w-5 h-5 transform rotate-90" />
              )}
            </motion.button>
          </motion.form>
        </div>
      </footer>
    </div>
  );
};

export default ChatAI;