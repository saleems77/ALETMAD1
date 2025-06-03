"use client";
import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit3, FiTrash2, FiSave, FiInfo, FiX } from 'react-icons/fi';

const AddEduGat = () => {
  const { user } = useSelector((state) => state.auth);
  const [tracks, setTracks] = useState([]);
  const [trackData, setTrackData] = useState({
    name: '',
    description: '',
    numOfCourse: 0,
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // جلب مسارات المستخدم
 const fetchUserTracks = async () => {
    try {
      setLoading(true);
      const response = await api.getUserTracks(user?.id);
      
      // التحقق من بنية الاستجابة
      const safeData = response?.data?.data || [];
      
      const formattedTracks = safeData.map(track => ({
        id: track?.id?.toString() || Date.now().toString(),
        name: track?.name || 'بدون اسم',
        description: track?.description || 'لا يوجد وصف',
        numOfCourse: track?.numOfCourse || 0,
        createdAt: track?.createdAt 
          ? new Date(track.createdAt).toLocaleDateString('ar-EG')
          : 'تاريخ غير معروف'
      }));
      
      setTracks(formattedTracks);
    } catch (err) {
      handleApiError(err, 'فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (user?.id) fetchUserTracks();
  }, [user]);

  // معالجة الإرسال
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const payload = {
        data: {
          ...trackData,
          numOfCourse: Number(trackData.numOfCourse),
          users_permissions_user: user.id
        }
      };

      let response;
      if (editId) {
        response = await api.updateTrack(editId, payload);
        setTracks(tracks.map(t => 
          t.id === editId ? { 
            ...response.data.data.attributes, 
            id: editId,
            createdAt: new Date().toLocaleDateString('ar-EG')
          } : t
        ));
      } else {
        response = await api.createTrack(payload);
        setTracks([{ 
          ...response.data.data.attributes, 
          id: response.data.data.id,
          createdAt: new Date().toLocaleDateString('ar-EG')
        }, ...tracks]);
      }

      resetForm();
      setSuccess(editId ? 'تم تحديث المسار بنجاح 🎉' : 'تم إضافة المسار بنجاح 🎉');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      handleApiError(err, 'حدث خطأ أثناء العملية');
    } finally {
      setLoading(false);
    }
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const errors = [];
    if (!trackData.name?.trim()) errors.push('اسم المسار مطلوب');
    if (isNaN(Number(trackData.numOfCourse))) errors.push('عدد الدورات يجب أن يكون رقمًا');

    if (errors.length > 0) {
      setError(errors.join(' - '));
      return false;
    }
    return true;
  };

  // معالجة الأخطاء
  const handleApiError = (error, defaultMessage) => {
    const errorMessage = error.response?.data?.error?.message || 
                        error.message || 
                        defaultMessage;
    
    setError(errorMessage);
    setTimeout(() => setError(''), 5000);
  };

  // تعبئة الحقول عند التعديل
  const handleEdit = (track) => {
    if (!track) return; // التحقق من وجود track
    
    setTrackData({
      name: track.name || '',
      description: track.description || '',
      numOfCourse: track.numOfCourse || 0
    });
    
    setEditId(track.id);
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth',
      // إضافة تأخير بسيط لضمان التمرير بعد تحديث الحالة
      block: 'start' 
    });
  };

  // حذف المسار
  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المسار؟')) return;
    
    try {
      setLoading(true);
      await api.deleteTrack(id);
    
    setSuccess('تم الحذف بنجاح');
    setTimeout(() => setSuccess(''), 3000);
          await fetchUserTracks();

  } catch (err) {
    console.error('تفاصيل خطأ الحذف:', {
      status: err.response?.status,
      data: err.response?.data
    });
    setError('فشل في الحذف - تحقق من الصلاحيات');
  } finally {
    setLoading(false);
  }
};

  // إعادة تعيين النموذج
  const resetForm = () => {
    setTrackData({
      name: '',
      description: '',
      numOfCourse: 0
    });
    setEditId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen"
    >
      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-lg flex items-center gap-2"
          >
            <FiInfo />
            <span>{error}</span>
            <button onClick={() => setError('')}>
              <FiX />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-lg flex items-center gap-2"
          >
            <FiInfo />
            <span>{success}</span>
            <button onClick={() => setSuccess('')}>
              <FiX />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نموذج الإدخال */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editId ? 'تعديل المسار' : 'إضافة مسار جديد'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المسار *
              <input
                type="text"
                value={trackData.name}
                onChange={(e) => setTrackData({...trackData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل اسم المسار"
                required
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عدد الدورات *
              <input
                type="number"
                value={trackData.numOfCourse}
                onChange={(e) => setTrackData({...trackData, numOfCourse: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف
              <textarea
                value={trackData.description}
                onChange={(e) => setTrackData({...trackData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="أدخل وصفًا للمسار"
              />
            </label>
          </div>

          <div className="md:col-span-2 flex justify-end gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white rounded-lg flex items-center gap-2 ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <span className="animate-pulse">جاري الحفظ...</span>
              ) : (
                <>
                  {editId ? <FiSave /> : <FiPlus />}
                  {editId ? 'حفظ التعديلات' : 'إضافة مسار'}
                </>
              )}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
              >
                <FiX />
                إلغاء التعديل
              </button>
            )}
          </div>
        </form>
      </div>

      {/* قائمة المسارات */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-8 text-gray-500">جاري تحميل البيانات...</div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['اسم المسار', 'عدد الدورات', 'تاريخ الإضافة', 'الإجراءات'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {tracks.map((track) => (
                  <motion.tr
                    key={track.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">{track.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{track.numOfCourse}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{track.createdAt}</td>
                    <td className="px-6 py-4 text-sm flex gap-3 justify-end">
                      <button
                        onClick={() => handleEdit(track)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <FiEdit3 />
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(track.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <FiTrash2 />
                        حذف
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {tracks.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                لا توجد مسارات مضافة حالياً
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AddEduGat;