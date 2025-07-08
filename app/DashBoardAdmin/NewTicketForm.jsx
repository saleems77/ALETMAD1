"use client"
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAsyncThunk } from '@reduxjs/toolkit';

const NewTicketForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    content: "",
    users_permissions_user: "" // سيتم ملؤه بـ documentId عند الحاجة
  });

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/support-tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          data: {
            content: formData.content,
            users_permissions_user: formData.users_permissions_user // استخدام documentId
          }
        })
      });
      if (!res.ok) throw new Error('فشل إنشاء التذكرة');
      const data = await res.json();
      dispatch(fetchAllTickets()); // تحديث قائمة التذاكر
      onClose();
    } catch (error) {
      console.error('خطأ:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">إنشاء تذكرة جديدة</h3>
          <button onClick={onClose} className="text-gray-500 text-2xl">×</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">محتوى التذكرة</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>
          <div>
            <label className="block mb-1">المستخدم (documentId)</label>
            <input
              type="text"
              value={formData.users_permissions_user}
              onChange={(e) => setFormData({...formData, users_permissions_user: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="أدخل documentId للمستخدم"
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