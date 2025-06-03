"use client"
import React, { useState } from 'react';

const AddEduGat = () => {
  const [tracks, setTracks] = useState([]);
  const [trackName, setTrackName] = useState('');
  const [category, setCategory] = useState('');
  const [coursesCount, setCoursesCount] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  // إضافة أو تعديل مسار
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trackName || !category) return;

    const newTrack = {
      id: Date.now(),
      trackName,
      category,
      coursesCount,
      description,
      createdAt: new Date().toLocaleDateString()
    };

    if (editId) {
      setTracks(tracks.map(t => t.id === editId ? newTrack : t));
      setEditId(null);
    } else {
      setTracks([...tracks, newTrack]);
    }

    // تفريغ الحقول بعد الإرسال
    setTrackName('');
    setCategory('');
    setCoursesCount('');
    setDescription('');
  };

  // حذف مسار
  const handleDelete = (id) => {
    setTracks(tracks.filter(track => track.id !== id));
  };

  // تحرير مسار
  const handleEdit = (track) => {
    setTrackName(track.trackName);
    setCategory(track.category);
    setCoursesCount(track.coursesCount);
    setDescription(track.description);
    setEditId(track.id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* نموذج الإضافة */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editId ? 'تعديل المسار التعليمي' : 'إضافة مسار تعليمي جديد'}
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم المسار</label>
            <input
              type="text"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            >
              <option value="">اختر الفئة</option>
              <option value="تطوير الويب">تطوير الويب</option>
              <option value="علوم البيانات">علوم البيانات</option>
              <option value="التسويق الرقمي">التسويق الرقمي</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">عدد الدورات</label>
            <input
              type="number"
              value={coursesCount}
              onChange={(e) => setCoursesCount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              min="1"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              rows="3"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {editId ? 'تحديث' : 'إضافة'}
            </button>

            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setTrackName('');
                  setCategory('');
                  setCoursesCount('');
                  setDescription('');
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                إلغاء التعديل
              </button>
            )}
          </div>
        </form>
      </div>

      {/* جدول المسارات */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم المسار</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الفئة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عدد الدورات</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الإضافة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tracks.map((track) => (
              <tr key={track.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{track.trackName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{track.category}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{track.coursesCount}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{track.createdAt}</td>
                <td className="px-6 py-4 text-sm flex gap-3 justify-end">
                  <button
                    onClick={() => handleEdit(track)}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(track.id)}
                    className="text-red-600 hover:text-red-900 flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tracks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد مسارات مضافة حالياً
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEduGat;