"use client"
import React, { useState, forwardRef, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import { Upload, CircleDollarSign, CalendarDays, Info, X, ChevronDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toastt';
import { useSelector } from 'react-redux';
import qs from 'qs';

const AdCampaignManager = forwardRef(({ onCreateCampaign }, ref) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    startDate: new Date(),
    endDate: new Date(),
    bannerImageFile: null,
    bannerImagePreview: null,
    courseId: ''
  });
  
  const { user } = useSelector((state) => state.auth);
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // استخدم useRef لتجنب إعادة جلب البيانات عند كل تغيير
  const hasFetched = React.useRef(false);

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("jwt");
      if (!token || !user?.id) return;

      const query = qs.stringify({
        filters: {
          users_permissions_user: {
            id: {
              $eq: user.id
            }
          }
        },
        fields: ['courseName', 'price', 'documentId']
      }, { encodeValuesOnly: true });

      const response = await fetch(`${API_URL}/courses?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('فشل جلب الدورات');

      const { data } = await response.json();
      
      // تحويل البيانات بشكل صحيح
      const formattedCourses = Array.isArray(data)
        ? data.map(course => ({
            id: course.documentId,
            title: course.courseName,
            price: course.price || 0
          }))
        : [{
            id: data.documentId,
            title: data.courseName,
            price: data.price || 0
          }];

      setCourses(formattedCourses);
      hasFetched.current = true;
    } catch (err) {
      console.error('خطأ في جلب الدورات:', err);
      setError(err.message);
      toast({
        title: "⚠️ خطأ",
        description: "حدث خطأ أثناء جلب الدورات",
        className: 'bg-danger/20 border-danger/30'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, API_URL]); // إزالة toast من التبعيات

  useEffect(() => {
    // جلب البيانات مرة واحدة فقط عند تحميل المكون
    if (user?.id && !hasFetched.current) {
      fetchCourses();
    }
  }, [user?.id, fetchCourses]);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "⚠️ خطأ في الحجم",
          description: "حجم الصورة يجب ألا يتجاوز 5MB",
          className: 'bg-danger/20 border-danger/30'
        });
        return;
      }
      
      const previewUrl = URL.createObjectURL(file);
      setFormData({ 
        ...formData, 
        bannerImageFile: file,
        bannerImagePreview: previewUrl
      });
    }
  };

  const handleRemoveImage = () => {
    if (formData.bannerImagePreview) {
      URL.revokeObjectURL(formData.bannerImagePreview);
    }
    setFormData({ 
      ...formData, 
      bannerImageFile: null,
      bannerImagePreview: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من الصحة
    const newErrors = {};
    if (!formData.courseId) newErrors.courseId = 'يجب اختيار دورة';
    if (!formData.title) newErrors.title = 'يجب إدخال عنوان للحملة';
    if (!formData.budget || formData.budget < 100) newErrors.budget = 'الميزانية يجب أن تكون 100 ر.س على الأقل';
    if (formData.endDate < formData.startDate) newErrors.dates = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // إنشاء الحملة
      await onCreateCampaign(formData);
      
      // إعادة تعيين النموذج
      setFormData({
        title: '',
        description: '',
        budget: '',
        startDate: new Date(),
        endDate: new Date(),
        bannerImageFile: null,
        bannerImagePreview: null,
        courseId: ''
      });
    } catch (error) {
      toast({
        title: "⚠️ خطأ",
        description: "حدث خطأ أثناء إنشاء الحملة",
        className: 'bg-danger/20 border-danger/30'
      });
    }
  };

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-3xl shadow-hard-lg border border-gray-200"
    >
      <div className="flex items-start gap-4 mb-10">
        <div className="p-3 bg-blue-100 rounded-xl">
          <CircleDollarSign className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إنشاء حملة إعلانية جديدة</h2>
          <p className="text-gray-500 flex items-center gap-2 mt-2">
            <Info className="w-4 h-4" />
            الحملات النشطة تظهر لمدة 30 يوم كحد أقصى
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Selection */}
          <div className="space-y-4">
            <label className="block text-gray-900 text-lg font-medium flex items-center gap-2">
              اختيار الدورة
              <Info className="w-4 h-4 text-gray-400" />
            </label>
            <div className="relative">
              <select
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 appearance-none bg-white pr-12"
        value={formData.courseId}
        onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
      >
        <option value="">-- اختر دورة --</option>
        {isLoading ? (
          <option disabled>جاري تحميل الدورات...</option>
        ) : error ? (
          <option disabled>خطأ في تحميل الدورات</option>
        ) : courses.length === 0 ? (
          <option disabled>لا توجد دورات متاحة</option>
        ) : (
          courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.title} {/* استخدام course.title بدلاً من course.name */}
            </option>
          ))
        )}
      </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            <AnimatePresence>
              {errors.courseId && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-600 flex items-center gap-2 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.courseId}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Campaign Title */}
          <div className="space-y-4">
            <label className="block text-gray-900 text-lg font-medium">عنوان الحملة</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                placeholder="أدخل عنوان الحملة"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <AnimatePresence>
              {errors.title && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-600 flex items-center gap-2 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-gray-900 text-lg font-medium">وصف الحملة</label>
          <textarea
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 min-h-[120px]"
            placeholder="أدخل وصفاً للحملة"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget Input */}
          <div className="space-y-4">
            <label className="block text-gray-900 text-lg font-medium">الميزانية اليومية</label>
            <div className="relative">
              <input
                type="number"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 pr-20"
                placeholder="500"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-gray-500">ر.س</span>
                <div className="w-px h-6 bg-gray-200" />
                <CircleDollarSign className="text-blue-500 w-5 h-5" />
              </div>
            </div>
            <AnimatePresence>
              {errors.budget && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-600 flex items-center gap-2 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.budget}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Picker Section */}
          <div className="space-y-4">
            <label className="block text-gray-900 text-lg font-medium flex items-center gap-2">
              تاريخ البداية
              <CalendarDays className="w-5 h-5 text-blue-500" />
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              popperPlacement="auto"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-gray-900 text-lg font-medium flex items-center gap-2">
              تاريخ النهاية
              <CalendarDays className="w-5 h-5 text-blue-500" />
            </label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300"
              dateFormat="dd/MM/yyyy"
              minDate={formData.startDate}
              popperPlacement="auto"
            />
          </div>
        </div>

        <AnimatePresence>
          {errors.dates && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-600 flex items-center gap-2 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.dates}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Banner Upload Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 text-lg font-medium">البانر الإعلاني</h3>
              <p className="text-gray-400 text-sm">الحجم المقترح: 1200x600 بكسل (JPG, PNG)</p>
            </div>
            {formData.bannerImagePreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-red-600 hover:text-red-800 flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                إزالة الصورة
              </button>
            )}
          </div>

          <label className={`
            group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer
            ${formData.bannerImagePreview ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
            transition-all duration-200
          `}>
            <div className="space-y-4 text-center">
              <div className="relative inline-block">
                <Upload className="w-12 h-12 text-blue-500 mb-4 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg group-hover:blur-xl transition-all" />
              </div>
              <p className="text-gray-500 group-hover:text-gray-700">
                {formData.bannerImagePreview ? 'تم الرفع بنجاح' : 'انقر للرفع أو اسحب الملف هنا'}
              </p>
              {!formData.bannerImagePreview && (
                <p className="text-sm text-gray-400">الحجم الأقصى: 5MB</p>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {formData.bannerImagePreview && (
              <motion.img 
                src={formData.bannerImagePreview}
                alt="Banner Preview"
                className="mt-6 h-48 w-full object-cover rounded-xl border border-gray-200 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-medium 
            transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <CircleDollarSign className="w-6 h-6" />
            نشر الحملة الإعلانية
          </button>
        </div>
      </form>
    </motion.div>
  );
});

AdCampaignManager.displayName = 'AdCampaignManager';

export default AdCampaignManager;