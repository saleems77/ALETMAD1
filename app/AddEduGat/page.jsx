"use client";
import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit3, FiSave, FiInfo, FiX, FiClock, FiBookOpen, FiUser } from 'react-icons/fi';

// تعريف الألوان بالنسب المحددة
const COLORS = {
  blue: '#008DCB',    // 10%
  black: '#0D1012',   // 5%
  gray: '#999999',    // 20%
  red: '#E2101E',     // 7%
  white: '#FFFFFF',   // 50%
  yellow: '#F9D011',  // 8%
};

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
  const [expandedTrack, setExpandedTrack] = useState(null);

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
  ...trackData,
 name: trackData.name,
  description: trackData.description,
  numOfCourse: Number(trackData.numOfCourse),
  users_permissions_user: user.id
};

      let response;
      if (editId) {
        // التحديث: استدعاء API بدون user.id كمعامل ثالث
        response = await api.updateTrack(editId, payload);
        
        // التحديث: معالجة الاستجابة بشكل صحيح لـ Strapi v4
        setTracks(tracks.map(t => 
  t.id === editId ? { 
    ...t, 
    ...response.data, 
    id: editId,
    createdAt: new Date(response.data.createdAt).toLocaleDateString('ar-EG')
  } : t
));
      } else {
        response = await api.createTrack(payload);
        setTracks([{ 
          ...response.data, 
          id: response.data.id,
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
    let errorMessage = defaultMessage;
    
    if (error.response) {
      // تحسين رسائل الأخطاء بناءً على حالة الاستجابة
      if (error.response.status === 404) {
        errorMessage = 'المسار غير موجود';
      } else if (error.response.status === 403) {
        errorMessage = 'ليس لديك صلاحية لتعديل هذا المسار';
      } else {
        errorMessage = error.response.data?.error?.message || defaultMessage;
      }
    } else {
      errorMessage = error.message || defaultMessage;
    }
    
    setError(errorMessage);
    setTimeout(() => setError(''), 5000);
  };

  // تعبئة الحقول عند التعديل
  const handleEdit = (track) => {
    if (!track) return;
    
    setTrackData({
      name: track.name || '',
      description: track.description || '',
      numOfCourse: track.numOfCourse || 0
    });
    
    setEditId(track.id);
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth',
      block: 'start' 
    });
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

  // تبديل تفاصيل المسار
  const toggleTrackDetails = (id) => {
    setExpandedTrack(expandedTrack === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 md:p-6"
      style={{ backgroundColor: COLORS.white }}
    >
      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 p-4 rounded-lg shadow-lg flex items-center gap-2 z-50"
            style={{ backgroundColor: COLORS.red, color: COLORS.white }}
          >
            <FiInfo className="text-xl" />
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
            className="fixed top-6 right-6 p-4 rounded-lg shadow-lg flex items-center gap-2 z-50"
            style={{ backgroundColor: COLORS.yellow, color: COLORS.black }}
          >
            <FiInfo className="text-xl" />
            <span>{success}</span>
            <button onClick={() => setSuccess('')}>
              <FiX />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* شريط العنوان */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.black }}>
          إدارة المسارات التعليمية
        </h1>
        <p className="text-lg" style={{ color: COLORS.gray }}>
          قم بإضافة وتعديل مساراتك التعليمية بسهولة
        </p>
      </div>

      {/* نموذج الإدخال */}
      <motion.div 
        className="rounded-xl shadow-lg p-6 mb-8"
        style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.gray}20` }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.blue + '20' }}
          >
            <FiPlus className="text-xl" style={{ color: COLORS.blue }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: COLORS.black }}>
            {editId ? 'تعديل المسار' : 'إضافة مسار جديد'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.black }}>
              اسم المسار *
              <div className="relative mt-1">
                <input
                  type="text"
                  value={trackData.name}
                  onChange={(e) => setTrackData({...trackData, name: e.target.value})}
                  className="w-full p-3 rounded-lg focus:ring-2 focus:outline-none transition-all"
                  style={{ 
                    border: `1px solid ${COLORS.gray}80`,
                    backgroundColor: COLORS.white,
                  }}
                  placeholder="أدخل اسم المسار"
                  required
                />
                <div 
                  className="absolute inset-y-0 left-0 w-1 rounded-l-lg"
                  style={{ backgroundColor: COLORS.blue }}
                ></div>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.black }}>
              عدد الدورات *
              <div className="relative mt-1">
                <input
                  type="number"
                  value={trackData.numOfCourse}
                  onChange={(e) => setTrackData({...trackData, numOfCourse: e.target.value})}
                  className="w-full p-3 rounded-lg focus:ring-2 focus:outline-none transition-all"
                  style={{ 
                    border: `1px solid ${COLORS.gray}80`,
                    backgroundColor: COLORS.white,
                  }}
                  min="0"
                  required
                />
                <div 
                  className="absolute inset-y-0 left-0 w-1 rounded-l-lg"
                  style={{ backgroundColor: COLORS.yellow }}
                ></div>
              </div>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.black }}>
              الوصف
              <div className="relative mt-1">
                <textarea
                  value={trackData.description}
                  onChange={(e) => setTrackData({...trackData, description: e.target.value})}
                  className="w-full p-3 rounded-lg focus:ring-2 focus:outline-none transition-all"
                  style={{ 
                    border: `1px solid ${COLORS.gray}80`,
                    backgroundColor: COLORS.white,
                  }}
                  rows="4"
                  placeholder="أدخل وصفًا للمسار"
                />
                <div 
                  className="absolute inset-y-0 left-0 w-1 rounded-l-lg"
                  style={{ backgroundColor: COLORS.gray }}
                ></div>
              </div>
            </label>
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:shadow-lg font-medium"
              style={{ 
                backgroundColor: loading ? COLORS.gray : COLORS.blue,
                color: COLORS.white
              }}
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
                className="px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:shadow-lg font-medium"
                style={{ 
                  backgroundColor: COLORS.gray,
                  color: COLORS.white
                }}
              >
                <FiX />
                إلغاء التعديل
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* قائمة المسارات */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.black }}>
            المسارات التعليمية
          </h2>
          <div className="text-sm" style={{ color: COLORS.gray }}>
            إجمالي المسارات: {tracks.length}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: COLORS.blue }}></div>
            <p className="mt-4" style={{ color: COLORS.gray }}>جاري تحميل بيانات المسارات...</p>
          </div>
        ) : tracks.length === 0 ? (
          <motion.div 
            className="text-center py-12 rounded-xl border-2 border-dashed"
            style={{ 
              backgroundColor: COLORS.white,
              borderColor: COLORS.gray + '50',
              color: COLORS.gray 
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FiBookOpen className="mx-auto text-4xl mb-4" />
            <h3 className="text-xl font-medium mb-2">لا توجد مسارات مضافة</h3>
            <p>ابدأ بإضافة مسارك التعليمي الأول باستخدام النموذج أعلاه</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tracks.map((track) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg"
                style={{ backgroundColor: COLORS.white }}
              >
                <div 
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleTrackDetails(track.id)}
                  style={{ backgroundColor: COLORS.gray + '10' }}
                >
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: COLORS.black }}>
                      {track.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm" style={{ color: COLORS.gray }}>
                        <FiBookOpen />
                        <span>{track.numOfCourse} دورات</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm" style={{ color: COLORS.gray }}>
                        <FiClock />
                        <span>{track.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(track);
                      }}
                      className="p-2 rounded-lg flex items-center gap-1 transition-all hover:bg-opacity-10"
                      style={{ 
                        backgroundColor: COLORS.blue + '20',
                        color: COLORS.blue
                      }}
                    >
                      <FiEdit3 />
                      <span className="hidden sm:inline">تعديل</span>
                    </button>
                    <div 
                      className={`transform transition-transform ${expandedTrack === track.id ? 'rotate-180' : ''}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: COLORS.gray }}>
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedTrack === track.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t" style={{ borderColor: COLORS.gray + '20' }}>
                        <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: COLORS.black }}>
                          <FiInfo style={{ color: COLORS.blue }} />
                          وصف المسار
                        </h4>
                        <p className="text-sm" style={{ color: COLORS.gray }}>
                          {track.description || 'لا يوجد وصف للمسار'}
                        </p>
                        
                        <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: COLORS.gray }}>
                          <FiUser />
                          <span>تم إنشاؤه بواسطة: {user?.username || 'مستخدم'}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* إشعارات الهاتف */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden">
        <AnimatePresence>
          {error && (
            <motion.div
              key="mobile-error"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="p-3 rounded-lg shadow-lg flex items-center gap-2"
              style={{ backgroundColor: COLORS.red, color: COLORS.white }}
            >
              <FiInfo className="text-xl" />
              <span className="text-sm">{error}</span>
              <button onClick={() => setError('')} className="ml-auto">
                <FiX />
              </button>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              key="mobile-success"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="p-3 rounded-lg shadow-lg flex items-center gap-2"
              style={{ backgroundColor: COLORS.yellow, color: COLORS.black }}
            >
              <FiInfo className="text-xl" />
              <span className="text-sm">{success}</span>
              <button onClick={() => setSuccess('')} className="ml-auto">
                <FiX />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AddEduGat;