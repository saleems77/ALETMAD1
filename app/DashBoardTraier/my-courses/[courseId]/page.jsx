"use client";

import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiEdit, FiTrash2, FiUserPlus } from 'react-icons/fi';

export default function TrainerAssistants() {
  // الحصول على معرّف الدورة من الرابط
  const { courseId } = useParams();
  const searchParams = useSearchParams();
  // قراءة query parameter لإظهار مؤشر نجاح إضافة المساعد
  const assistantAdded = searchParams.get("assistantAdded");

  // بيانات افتراضية للمساعدين (يمكن استبدالها ببيانات من API)
  const [assistants, setAssistants] = useState([
    { id: 1, name: 'محمد أحمد', email: 'mohamed@example.com' },
    { id: 2, name: 'سارة علي', email: 'sara@example.com' },
  ]);

  // دالة لحذف مساعد
  const handleDelete = (id) => {
    if (confirm("هل أنت متأكد من حذف هذا المساعد؟")) {
      setAssistants(assistants.filter((assistant) => assistant.id !== id));
    }
  };

  // دالة لتحرير مساعد (يمكن توسيعها حسب الحاجة)
  const handleEdit = (assistant) => {
    // يمكنك فتح مودال أو توجيه المستخدم إلى صفحة التعديل
    console.log("Edit assistant:", assistant);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* رأس الصفحة مع عنوان الدورة وإشارة نجاح إضافة المساعد */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          مساعدو الدورة {courseId}
          {assistantAdded === "true" && (
            <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              تم إضافة مساعد!
            </span>
          )}
        </h1>
        {/* زر التنقل لإضافة مساعد جديد */}
        <Link href={`/trainer/assistants/${courseId}/addAssistant`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            <FiUserPlus className="w-5 h-5" />
            إضافة مساعد جديد
          </motion.button>
        </Link>
      </div>

      {/* جدول عرض المساعدين */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                الاسم
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                البريد الإلكتروني
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assistants.length > 0 ? (
              assistants.map((assistant) => (
                <motion.tr
                  key={assistant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assistant.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assistant.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(assistant)}
                        className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100"
                        title="تعديل"
                      >
                        <FiEdit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(assistant.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg bg-red-50 hover:bg-red-100"
                        title="حذف"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                  لا يوجد مساعدين مسجلين
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
