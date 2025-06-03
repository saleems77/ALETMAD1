"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function AddAssistantPage() {
  const { courseId } = useParams();
  const router = useRouter();
  
  const [assistantData, setAssistantData] = useState({
    name: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // التعامل مع تغير الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssistantData((prev) => ({ ...prev, [name]: value }));
  };

  // معالجة إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!assistantData.name || !assistantData.email) {
      setError('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    // محاكاة نداء API لإضافة المساعد
    setTimeout(() => {
      setLoading(false);
      // بعد الإضافة، إعادة التوجيه إلى صفحة المساعدين مع تمرير مؤشر نجاح العملية
      router.push(`/DashBoardTraier/my-courses/${courseId}?assistantAdded=true`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          إضافة مساعد للدورة
        </h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم الكامل
            </label>
            <input
              type="text"
              name="name"
              value={assistantData.name}
              onChange={handleChange}
              placeholder="أدخل الاسم الكامل"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={assistantData.email}
              onChange={handleChange}
              placeholder="أدخل البريد الإلكتروني"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            {loading ? "جارٍ الإضافة..." : "إضافة المساعد"}
            {loading ? null : <FiCheck className="w-5 h-5" />}
          </motion.button>
          <Link href={`/DashBoardTraier/my-courses/${courseId}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 p-3 rounded-xl font-medium hover:bg-gray-100 transition-all"
            >
              إلغاء
              <FiX className="w-5 h-5" />
            </motion.button>
          </Link>
        </form>
      </motion.div>
    </div>
  );
}
