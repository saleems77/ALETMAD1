// app/materials/AddMaterialForm.jsx
'use client';
import React, { useState } from 'react';

// دالة منفصلة لرفع المادة إلى Strapi (للتخلص من الكود المتكرر)
const uploadMaterialToAPI = async ({ description, price, file, courseId, token, API_URL }) => {
  const formData = new FormData();
  formData.append('files.attachment', file); // رفع الملف
  formData.append('data', JSON.stringify({
    description,
    price: parseFloat(price),
  course: { id: courseId } // تعديل هنا: استخدام كائن { id: courseId }
  }));

  const response = await fetch(`${API_URL}/materials`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'فشل في إضافة المادة.');
  }

  return await response.json(); // إرجاع البيانات الناتجة
};

export default function AddMaterialForm({ courseId }) {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

const uploadFileToAPI = async ({ file, token, API_URL }) => {
  const formData = new FormData();
  formData.append('files', file); // رفع الملف فقط

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'فشل في رفع الملف.');
  }

  const data = await response.json();
  return data[0]; // إرجاع مُعرّف الملف (id)
};
const createMaterialInAPI = async ({ description, price, fileId, courseId, token, API_URL }) => {
  const response = await fetch(`${API_URL}/materials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        description,
        price: parseFloat(price),
        course: { id: courseId },
        attachment: fileId // ربط الملف عبر مُعرّف الملف
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'فشل في إنشاء المادة.');
  }

  return await response.json();
};
  const handleSubmit = async (e) => {
  e.preventDefault();

  // التحقق من الحقول المطلوبة
  if (!file || !description || !price || !courseId) {
    setMessage({ type: 'error', text: 'يرجى ملء جميع الحقول واختيار ملف.' });
    return;
  }

  setIsSubmitting(true);
  setMessage({ type: '', text: '' });

  try {
    const token = localStorage.getItem("jwt");
    const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

    // خطوة 1: رفع الملف
    const uploadedFile = await uploadFileToAPI({ file, token, API_URL });

    // خطوة 2: إنشاء المادة مع ربط الملف
    await createMaterialInAPI({
      description,
      price,
      fileId: uploadedFile.id,
      courseId,
      token,
      API_URL
    });

    // إعادة تعيين الحقول بعد النجاح
    setMessage({ type: 'success', text: 'تمت إضافة المادة والملف بنجاح!' });
    setDescription('');
    setPrice('');
    setFile(null);
    e.target.reset();

  } catch (err) {
    setMessage({ type: 'error', text: err.message });
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">إضافة مادة تعليمية جديدة</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">الوصف</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows="4"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">السعر ($)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">ملف المادة</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'جاري الإضافة...' : 'إضافة المادة'}
        </button>

        {/* مؤشر تحميل */}
        {isSubmitting && (
          <div className="flex justify-center items-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* رسالة النجاح أو الخطأ */}
        {message.text && (
          <p className={`text-sm mt-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}