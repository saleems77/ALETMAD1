'use client';
import { useState } from 'react';

export default function ContactForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active'
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">إضافة عميل جديد</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="الاسم الكامل"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <button 
          onClick={() => onSubmit(formData)}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          حفظ العميل
        </button>
      </div>
    </div>
  );
}