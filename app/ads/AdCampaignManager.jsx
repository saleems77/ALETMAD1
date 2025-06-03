"use client"
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Upload, CircleDollarSign, CalendarDays, Info, X, ChevronDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const AdCampaignManager = ({ courses = [], onCreateCampaign }) => {
  const [formData, setFormData] = useState({
    courseId: '',
    budget: '',
    startDate: new Date(),
    endDate: new Date(),
    bannerImage: null
  });

  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  // أنيميشن فارم
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
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
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, bannerImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // التحقق من الصحة
    const newErrors = {};
    if (!formData.courseId) newErrors.courseId = 'يجب اختيار دورة';
    if (!formData.budget || formData.budget < 100) newErrors.budget = 'الميزانية يجب أن تكون 100 ر.س على الأقل';
    if (formData.endDate < formData.startDate) newErrors.dates = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // إنشاء الحملة
    const newCampaign = {
      ...formData,
      id: Date.now(),
      status: 'pending',
      title: courses.find(c => c.id === formData.courseId)?.title || ''
    };
    onCreateCampaign(newCampaign);
    
    // إعادة تعيين النموذج
    setFormData({
      courseId: '',
      budget: '',
      startDate: new Date(),
      endDate: new Date(),
      bannerImage: null
    });
    
    // عرض إشعار النجاح
    toast({
      title: "🎉 تم إنشاء الحملة بنجاح!",
      description: "سيتم مراجعة الحملة من قبل الفريق المختص",
      className: 'bg-success/20 border-success/30'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-light p-8 rounded-3xl shadow-hard-lg border border-neutral/10"
    >
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-10">
        <div className="p-3 bg-primary/10 rounded-xl">
          <CircleDollarSign className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-dark">إنشاء حملة إعلانية جديدة</h2>
          <p className="text-neutral flex items-center gap-2 mt-2">
            <Info className="w-4 h-4" />
            الحملات النشطة تظهر لمدة 30 يوم كحد أقصى
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div variants={formVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Selection */}
          <div className="space-y-4">
            <label className="block text-dark text-lg font-medium flex items-center gap-2">
              اختيار الدورة
              <Info className="w-4 h-4 text-neutral/60" />
            </label>
            <div className="relative">
              <select
                className="w-full p-4 border-2 border-neutral/20 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none bg-light pr-12"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              >
                <option value="">-- اختر دورة --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral/60 pointer-events-none" />
            </div>
            <AnimatePresence>
              {errors.courseId && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-danger flex items-center gap-2 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.courseId}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Budget Input */}
          <div className="space-y-4">
            <label className="block text-dark text-lg font-medium">الميزانية اليومية</label>
            <div className="relative">
              <input
                type="number"
                className="w-full p-4 border-2 border-neutral/20 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary pr-20"
                placeholder="500"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-neutral/80">ر.س</span>
                <div className="w-px h-6 bg-neutral/20" />
                <CircleDollarSign className="text-primary/80 w-5 h-5" />
              </div>
            </div>
            <AnimatePresence>
              {errors.budget && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-danger flex items-center gap-2 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.budget}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Date Picker Section */}
        <motion.div variants={formVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-dark text-lg font-medium flex items-center gap-2">
              تاريخ البداية
              <CalendarDays className="w-5 h-5 text-primary/80" />
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              className="w-full p-4 border-2 border-neutral/20 rounded-xl focus:ring-2 focus:ring-primary/30"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              popperPlacement="auto"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-dark text-lg font-medium flex items-center gap-2">
              تاريخ النهاية
              <CalendarDays className="w-5 h-5 text-primary/80" />
            </label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
              className="w-full p-4 border-2 border-neutral/20 rounded-xl focus:ring-2 focus:ring-primary/30"
              dateFormat="dd/MM/yyyy"
              minDate={formData.startDate}
              popperPlacement="auto"
            />
          </div>
        </motion.div>

        {/* Banner Upload Section */}
        <motion.div variants={formVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-dark text-lg font-medium">البانر الإعلاني</h3>
              <p className="text-neutral/60 text-sm">الحجم المقترح: 1200x600 بكسل (JPG, PNG)</p>
            </div>
            {formData.bannerImage && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bannerImage: null })}
                className="text-danger hover:text-danger/80 flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                إزالة الصورة
              </button>
            )}
          </div>

          <label className={`
            group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer
            ${formData.bannerImage ? 'border-primary/20 bg-primary/5' : 'border-neutral/20 hover:border-primary/40'}
            transition-all duration-200
          `}>
            <div className="space-y-4 text-center">
              <div className="relative inline-block">
                <Upload className="w-12 h-12 text-primary mb-4 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-lg group-hover:blur-xl transition-all" />
              </div>
              <p className="text-neutral group-hover:text-dark">
                {formData.bannerImage ? 'تم الرفع بنجاح' : 'انقر للرفع أو اسحب الملف هنا'}
              </p>
              {!formData.bannerImage && (
                <p className="text-sm text-neutral/60">الحجم الأقصى: 5MB</p>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {formData.bannerImage && (
              <motion.img 
                src={formData.bannerImage}
                alt="Banner Preview"
                className="mt-6 h-48 w-full object-cover rounded-xl border border-neutral/10 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </label>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={formVariants}>
          <button
            type="submit"
            className="w-full py-4 bg-primary hover:bg-primary/90 text-light rounded-xl text-lg font-medium 
            transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <CircleDollarSign className="w-6 h-6" />
            نشر الحملة الإعلانية
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AdCampaignManager;