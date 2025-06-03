"use client"
import React, { useState } from 'react';

const NewTicketForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    user: '',
    email: '',
    type: 'فني',
    priority: 'متوسط',
    subject: '',
    message: ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      user: '',
      email: '',
      type: 'فني',
      priority: 'متوسط',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">إنشاء تذكرة جديدة</h3>
          <button onClick={onClose} className="text-gray-500 text-2xl">×</button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">اسم المستخدم</label>
              <input
                type="text"
                value={formData.user}
                onChange={(e) => setFormData({...formData, user: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">نوع التذكرة</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="فني">فني</option>
                <option value="مالي">مالي</option>
                <option value="محتوى">محتوى</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">الأولوية</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="عالي">عالي</option>
                <option value="متوسط">متوسط</option>
                <option value="منخفض">منخفض</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1">الموضوع</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">الرسالة</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded"
            onClick={onClose}
          >
            إلغاء
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            إنشاء التذكرة
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTicketForm;