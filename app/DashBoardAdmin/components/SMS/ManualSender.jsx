'use client';
import { useState, useEffect } from 'react';

export default function ManualSender() {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);

  // تحميل الإشعارات من localStorage عند التحميل
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  const handleSend = () => {
    if (!recipient || !message) {
      alert('الرجاء تعبئة جميع الحقول');
      return;
    }

    const newNotification = {
      id: Date.now(),
      type: 'manual',
      recipient,
      message,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    const updatedNotifications = [...notifications, newNotification];
    
    // حفظ في localStorage وتحديث الحالة
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
    
    // إعادة تعيين الحقول
    setRecipient('');
    setMessage('');
    
    alert('تم حفظ الإشعار بنجاح!');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold mb-4">إرسال إشعار يدوي</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="البريد الإلكتروني أو رقم الهاتف"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        <textarea
          placeholder="نص الإشعار"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border rounded-lg h-32"
        />
        <button 
          onClick={handleSend}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          حفظ الإشعار
        </button>
      </div>
    </div>
  );
}