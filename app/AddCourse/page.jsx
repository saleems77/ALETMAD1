    "use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Link from 'next/link';
import {
  FiUpload,
  FiPaperclip,
  FiX,
  FiFilm,
  FiVideo,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiPlus,
  FiEdit3,
  FiLock,
  FiArrowLeft,
  FiSave,
  FiBook,
  FiTarget,
  FiList,
  FiUsers,
  FiInfo,
  FiDollarSign,
  FiGift,
  FiImage
} from "react-icons/fi";

const COLORS = {
  primary: "#008DCB",
  secondary: "#0D1012",
  muted: "#999999",
  danger: "#E2101E",
  background: "#FFFFFF",
  accent: "#F9D011",
};

// تحديث مصفوفة الخطوات لإضافة خطوة جديدة
const STEPS = [
  { id: 1, title: "المعلومات الأساسية", icon: <FiBook /> },
  { id: 2, title: "صورة الغلاف", icon: <FiImage /> }, // خطوة جديدة
  { id: 3, title: "الأهداف التعليمية", icon: <FiTarget /> },
  { id: 4, title: "المتطلبات", icon: <FiList /> },
  { id: 5, title: "الفئة المستهدفة", icon: <FiUsers /> },
  { id: 6, title: "التسعير", icon: <FiDollarSign /> },
  { id: 7, title: "تعليمات الوصول", icon: <FiLock /> },
  { id: 8, title: "المرفقات", icon: <FiPaperclip /> },
  { id: 9, title: "المحتوى", icon: <FiFilm /> },
];

const AddCourseComponent = () => {
  const [formData, setFormData] = useState({
    courseName: "",
    track: null,
    coverImage: null, // حقل جديد لصورة الغلاف
    learningObjectives: "",
    requirements: "",
    targetAudience: "",
    price: 0,
    isFree: true,
    attachments: [],
    videos: [],
    newVideo: { title: "", file: null, duration: "" },
    hasEntryTest: false,
    accessInstructions: "",
  });
  
  const [activeStep, setActiveStep] = useState(1);
  const [error, setError] = useState("");
  const [tracks, setTracks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);
  const [coverImagePreview, setCoverImagePreview] = useState(null); // معاينة الصورة
const [isUploading, setIsUploading] = useState(false);
  // جلب الفئات من Strapi
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const { data } = await axios.get(
  `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tracks?populate=*`
        );
        setTracks(data.data); // Strapi v5 يعيد البيانات ضمن data.data
      } catch (error) {
        setError("فشل في تحميل الفئات التعليمية");
      } finally {
        setIsLoadingTracks(false);
      }
    };
    fetchTracks();
  }, []);

  // التحقق من صحة الخطوة
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return !!formData.courseName && !!formData.track?.id;
      case 2: // التحقق من صورة الغلاف
        return !!formData.coverImage;
      case 3:
        return !!formData.learningObjectives.trim();
      case 4:
        return !!formData.requirements;
      case 5:
        return !!formData.targetAudience;
      case 6:
        return formData.isFree || formData.price > 0;
      case 7:
        return !!formData.accessInstructions.trim();
      default:
        return true;
    }
  };

  // معالجة رفع الملفات
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    // التحقق من أنواع الملفات المسموحة
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      setError("الملفات المسموحة: PDF, DOC, DOCX, JPG, PNG");
      return;
    }
    
    // التحقق من حجم الملف (5MB كحد أقصى)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const largeFiles = files.filter((file) => file.size > maxSize);
    if (largeFiles.length > 0) {
      setError("الحجم الأقصى للملف الواحد 5MB");
      return;
    }
    
    const formDataUpload = new FormData();
    files.forEach((file) => formDataUpload.append("files", file));
    
    try {
      const { data } = await axios.post(
       `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/upload`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      // التحقق من استجابة Strapi
      if (data && data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            ...data.map((file) => ({
              id: file.id, // تأكد من الهيكل الصحيح للاستجابة
            })),
          ],
        }));
      } else {
        throw new Error("فشل في رفع الملفات");
      }
    } catch (error) {
      let errorMessage = "فشل في رفع الملفات";
      if (error.response) {
        // معالجة أخطاء Strapi
        switch (error.response.status) {
          case 401:
            errorMessage = "غير مصرح بالرفع، يرجى تسجيل الدخول";
            break;
          case 413:
            errorMessage = "الحجم الكلي للملفات يتجاوز الحد المسموح";
            break;
          case 400:
            errorMessage = "نوع الملف غير مدعوم";
            break;
          default:
            errorMessage = error.response.data?.error?.message || errorMessage;
        }
      }
      setError(errorMessage);
    }
  };

  // معالجة رفع صورة الغلاف
  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // التحقق من نوع الملف
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("نوع الصورة غير مدعوم. يُسمح بـ JPEG, PNG, أو WEBP");
      return;
    }
    
    // التحقق من الحجم (5MB كحد أقصى)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("الحجم الأقصى للصورة 5MB");
      return;
    }

    // إنشاء كائن FormData
    const formDataUpload = new FormData();
    formDataUpload.append("files", file);
    
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/upload`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      // تحديث حالة النموذج بصورة الغلاف
      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          coverImage: data[0].id
        }));
        
        // إنشاء معاينة للصورة
        const reader = new FileReader();
        reader.onload = (e) => {
          setCoverImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      let errorMessage = "فشل في رفع صورة الغلاف";
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "غير مصرح برفع الصور، يرجى تسجيل الدخول";
            break;
          case 413:
            errorMessage = "الصورة تتجاوز الحجم المسموح";
            break;
          default:
            errorMessage = error.response.data?.error?.message || errorMessage;
        }
      }
      setError(errorMessage);
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  // إضافة فيديو جديد
  const uploadVideo = async (file) => {
    const videoFormData = new FormData();
    videoFormData.append('files', file);
    videoFormData.append('fileInfo', JSON.stringify({
      alternativeText: `فيديو: ${file.name}`,
      caption: formData.newVideo.duration
    }));
    const { data } = await axios.post(
       `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/upload`,
      videoFormData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data[0].id; // إرجاع ID الفيديو
  };

  // إضافة فيديو جديد
  // تأكد من أن وظيفة handleAddVideo معرفة داخل المكون 
// وبعد تعريف setIsUploading
const handleAddVideo = async () => {
  if (!formData.newVideo.file || !formData.newVideo.title) return;
  try {
    setIsUploading(true);
    // رفع الفيديو وأخذ ID
    const videoId = await uploadVideo(formData.newVideo.file);
    // تحديث حالة الفيديوهات
    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, {
        title: prev.newVideo.title,
        duration: prev.newVideo.duration,
        videoFile: videoId // تخزين ID مباشر
      }],
      newVideo: { title: '', file: null, duration: '' }
    }));
  } catch (error) {
    setError('فشل في رفع الفيديو: ' + error.message);
  } finally {
    setIsUploading(false);
  }
};

  function getUserIdFromJwt(jwt) {
    try {
      const base64Url = jwt.split('.')[1];
      const base64 = base64Url.replace(/-/g, '_').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload.id; // ID المستخدم من التوكن
    } catch (e) {
      return null;
    }
  }

  const validateAllSteps = () => {
    return STEPS.every(step => validateStep(step.id));
  };

  // إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      setError('يرجى تسجيل الدخول أولاً');
      setIsSubmitting(false);
      return;
    }
    try {
      // استخرج ID المستخدم من التوكن
      const userId = getUserIdFromJwt(jwt);
      const payload = {
        data: {
          courseName: formData.courseName,
          learningObjectives: formData.learningObjectives,
          requirements: formData.requirements,
          targetAudience: formData.targetAudience,
          price: formData.price,
          isFree: formData.isFree,
          accessInstructions: formData.accessInstructions,
          hasEntryTest: formData.hasEntryTest,
          // علاقات Strapi 5
          track: formData.track.id, // manyToOne
          attachments: formData.attachments.map(f => f.id), // media مباشرة
          // ربط المستخدم
          users_permissions_user: userId, // manyToOne
          // فيديوهات كمركبات
          videos: formData.videos.map(video => ({
            title: video.title,
            duration: video.duration,
            videoFile: video.videoFile // ID مباشر
          })),
          // إضافة صورة الغلاف
          coverImage: formData.coverImage // علاقة media
        }
      };
      
      await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/courses`, payload, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json"
        }
      });
      
      alert('تم إنشاء الدورة بنجاح!');
      // إعادة تعيين النموذج
      setFormData({
        courseName: '',
        track: null,
        coverImage: null,
        learningObjectives: '',
        requirements: '',
        targetAudience: '',
        price: 0,
        isFree: true,
        accessInstructions: '',
        hasEntryTest: false,
        attachments: [],
        videos: [],
        newVideo: { title: '', file: null, duration: '' },
      });
      setCoverImagePreview(null);
      setActiveStep(1); // العودة إلى الخطوة الأولى
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 
                          error.response?.data?.error?.details?.errors?.[0]?.message || 
                          'حدث خطأ في الإرسال';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // مكون الخطوات
  const ProgressStepper = () => (
    <div className="relative px-6 pt-6 mb-8">
      <div className="flex justify-between relative">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center z-10"
            style={{ width: `${100 / STEPS.length}%` }}
          >
            <motion.div
              className="flex items-center justify-center rounded-full mb-2 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              onClick={() => validateStep(step.id) && setActiveStep(step.id)}
              style={{
                width: "3rem",
                height: "3rem",
                background:
                  activeStep >= step.id ? COLORS.primary : `${COLORS.muted}20`,
                color: activeStep >= step.id ? COLORS.background : COLORS.muted,
                boxShadow:
                  activeStep === step.id
                    ? `0 4px 12px ${COLORS.primary}30`
                    : "none",
              }}
            >
              {step.icon}
            </motion.div>
            <div className="text-center">
              <span
                className={`text-xs font-semibold ${
                  activeStep >= step.id ? "text-primary" : "text-muted"
                }`}
              >
                {step.title}
              </span>
            </div>
          </div>
        ))}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 mx-6">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{
              width: `${((activeStep - 1) / (STEPS.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );

  // رأس القسم
  const SectionHeader = ({ title, description, icon }) => (
    <motion.div
      className="mb-8 p-4 rounded-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: `${COLORS.primary}08`,
        border: `1px solid ${COLORS.primary}20`,
      }}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg" style={{ background: COLORS.primary }}>
          {icon}
        </div>
        <div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: COLORS.primary }}
          >
            {title}
          </h2>
          <p className="text-sm" style={{ color: COLORS.muted }}>
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );

  // حقل إدخال مع تحديث عند الخروج من الحقل
  const InputField = ({ label, children, isRequired, name, value, onUpdate }) => {
    // حالة محلية لتخزين القيمة أثناء الكتابة
    const [localValue, setLocalValue] = useState(value || "");

    // تحديث القيمة المحلية عند كل تغيير
    const handleChange = (e) => {
      setLocalValue(e.target.value);
    };

    // تحديث الحالة الرئيسية عند الخروج من الحقل
    const handleBlur = () => {
      onUpdate(name, localValue);
    };

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <label
            className="text-sm font-medium"
            style={{ color: COLORS.secondary }}
          >
            {label}
          </label>
          {isRequired && <span className="text-danger">*</span>}
        </div>
        {React.cloneElement(children, {
          value: localValue,
          onChange: handleChange,
          onBlur: handleBlur,
        })}
      </div>
    );
  };

  // محتوى الخطوات
  const StepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="p-6">
            <SectionHeader
              title="المعلومات الأساسية"
              description="أدخل التفاصيل الأساسية للدورة التعليمية"
              icon={<FiBook className="text-white text-xl" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <InputField
  label="اسم الدورة"
  isRequired
  name="courseName"
  value={formData.courseName}
  onUpdate={(name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary"
                  style={{
                    borderColor: `${COLORS.muted}40`,
                    focusBorderColor: COLORS.primary,
                  }}
                />
              </InputField>
           <InputField
  label="الفئة التعليمية"
  isRequired
  name="track"
  value={formData.track?.id || ""}
  onUpdate={(name, value) => {
    // تأكد من أن القيمة رقم
    const trackId = parseInt(value);
    
    // تأكد من أن القيمة صحيحة
    if (isNaN(trackId)) {
      setFormData({
        ...formData,
        track: null
      });
      return;
    }
    
    // ابحث عن الفئة في القائمة
    const selectedTrack = tracks.find((t) => t.id === trackId);
    
    // تأكد من وجود الفئة قبل استخدامها
    if (selectedTrack) {
      setFormData({
        ...formData,
        track: {
          id: selectedTrack.id,
          name: selectedTrack.name || selectedTrack.attributes?.name,
        },
      });
    } else {
      setFormData({
        ...formData,
        track: null
      });
    }
  }}
>
  <select
    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary"
    style={{
      borderColor: `${COLORS.muted}40`,
      focusBorderColor: COLORS.primary,
    }}
  >
    <option value="">اختر الفئة</option>
    {tracks.map((track) => (
      <option key={track.id} value={track.id}>
        {track.name || track.attributes?.name}
      </option>
    ))}
  </select>
</InputField>

{/* أضف زر الإضافة هنا */}
<div className="mt-4">
  <Link 
    href="/AddEduGat" 
    passHref
  >
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-3 rounded-lg flex items-center justify-center cursor-pointer"
      style={{
        background: COLORS.primary,
        color: COLORS.background,
        minWidth: "3rem"
      }}
      title="إضافة فئة جديدة"
      role="button"
    >
      <FiPlus className="text-xl" />
      <span className="ml-2">فئة جديدة</span>
    </motion.div>
  </Link>
</div>
</div>
</div>

        );
      case 2: // خطوة جديدة لصورة الغلاف
        return (
          <div className="p-6">
            <SectionHeader
              title="صورة الغلاف"
              description="قم برفع صورة غلاف للدورة التعليمية"
              icon={<FiImage className="text-white text-xl" />}
            />
            <div className="space-y-4">
              <label
                className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed cursor-pointer hover:border-primary transition-colors"
                style={{ borderColor: `${COLORS.muted}40` }}
              >
                <FiUpload className="text-muted" />
                <span className="text-sm">
                  اختر صورة أو اسحبها هنا (JPEG, PNG, WEBP)
                </span>
                <input
                  type="file"
                  onChange={handleCoverImageUpload}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                />
              </label>
              
              {/* معاينة الصورة */}
              {coverImagePreview && (
                <div className="relative mt-4">
                  <img
                    src={coverImagePreview}
                    alt="معاينة صورة الغلاف"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setCoverImagePreview(null);
                      setFormData(prev => ({ ...prev, coverImage: null }));
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-danger text-white"
                  >
                    <FiX />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-6">
            <SectionHeader
              title="الأهداف التعليمية"
              description="أدخل الأهداف التعليمية الرئيسية للدورة"
              icon={<FiTarget className="text-white text-xl" />}
            />
            <InputField
              label="الأهداف التعليمية"
              isRequired
              name="learningObjectives"
              value={formData.learningObjectives}
              onUpdate={(name, value) =>
                setFormData({ ...formData, [name]: value })
              }
            >
              <textarea
                className="w-full p-3 rounded-lg border border-gray-200 h-40"
                style={{ borderColor: `${COLORS.muted}40` }}
                placeholder="ادخل الأهداف التعليمية الرئيسية للدورة، كل هدف في سطر منفصل"
              />
            </InputField>
          </div>
        );
      case 4:
        return (
          <div className="p-6">
            <SectionHeader
              title="المتطلبات الأساسية"
              description="حدد المعرفة أو المهارات المطلوبة مسبقاً"
              icon={<FiList className="text-white text-xl" />}
            />
            <InputField
              label="المتطلبات الأساسية"
              isRequired
              name="requirements"
              value={formData.requirements}
              onUpdate={(name, value) =>
                setFormData({ ...formData, [name]: value })
              }
            >
              <textarea
                className="w-full p-3 rounded-lg border border-gray-200 h-40"
                style={{ borderColor: `${COLORS.muted}40` }}
                placeholder="مثال: معرفة أساسيات البرمجة، مهارات استخدام الحاسوب..."
              />
            </InputField>
          </div>
        );
      case 5:
        return (
          <div className="p-6">
            <SectionHeader
              title="الفئة المستهدفة"
              description="صف الفئة التي ستستفيد أكثر من هذه الدورة"
              icon={<FiUsers className="text-white text-xl" />}
            />
            <InputField
              label="الفئة المستهدفة"
              isRequired
              name="targetAudience"
              value={formData.targetAudience}
              onUpdate={(name, value) =>
                setFormData({ ...formData, [name]: value })
              }
            >
              <textarea
                className="w-full p-3 rounded-lg border border-gray-200 h-40"
                style={{ borderColor: `${COLORS.muted}40` }}
                placeholder="مثال: المبتدئين في البرمجة، محترفي التسويق الرقمي..."
              />
            </InputField>
          </div>
        );
      case 6:
        return (
          <div className="p-6">
            <SectionHeader
              title="تسعير الدورة"
              description="حدد نوع الدورة والسعر المناسب"
              icon={<FiDollarSign className="text-white text-xl" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="p-6 rounded-xl"
                style={{ background: `${COLORS.muted}08` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`p-3 rounded-lg cursor-pointer transition-all flex-1 text-center ${
                      formData.isFree ? "bg-primary text-white" : "bg-gray-100"
                    }`}
                    onClick={() => setFormData({ ...formData, isFree: true })}
                  >
                    <FiGift className="inline-block mb-1" /> مجانية
                  </div>
                  <div
                    className={`p-3 rounded-lg cursor-pointer transition-all flex-1 text-center ${
                      !formData.isFree
                        ? "bg-accent text-secondary"
                        : "bg-gray-100"
                    }`}
                    onClick={() => setFormData({ ...formData, isFree: false })}
                  >
                    <FiDollarSign className="inline-block mb-1" /> مدفوعة
                  </div>
                </div>
                {!formData.isFree && (
                  <InputField
                    label="سعر الدورة (USD)"
                    isRequired
                    name="price"
                    value={formData.price}
                    onUpdate={(name, value) =>
                      setFormData({
                        ...formData,
                        [name]: parseFloat(value) || 0,
                      })
                    }
                  >
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-3 rounded-lg border border-gray-200"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                        $
                      </span>
                    </div>
                  </InputField>
                )}
              </div>
              <div
                className="p-4 rounded-xl"
                style={{ background: `${COLORS.primary}08` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <FiInfo className="text-primary" />
                  <span className="font-medium">نصائح التسعير</span>
                </div>
                <p className="text-sm text-muted">
                  - اختر سعراً يعكس قيمة المحتوى المقدم
                  <br />
                  - يمكنك إضافة عروض ترويجية لاحقاً
                  <br />- السعر القياسي للدورات المشابهة: $20 - $200
                </p>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="p-6">
            <SectionHeader
              title="تعليمات الوصول"
              description="أدخل تعليمات الوصول إلى الدورة"
              icon={<FiLock className="text-white text-xl" />}
            />
            <InputField
              label="تعليمات الوصول"
              isRequired
              name="accessInstructions"
              value={formData.accessInstructions}
              onUpdate={(name, value) =>
                setFormData({ ...formData, [name]: value })
              }
            >
              <textarea
                className="w-full p-3 rounded-lg border border-gray-200 h-40"
                style={{ borderColor: `${COLORS.muted}40` }}
                placeholder="مثال: سيتم إرسال رابط الوصول عبر البريد الإلكتروني بعد التسجيل..."
              />
            </InputField>
          </div>
        );
      case 8:
        return (
          <div className="p-6">
            <SectionHeader
              title="المرفقات"
              description="قم برفع أي ملفات داعمة للدورة"
              icon={<FiPaperclip className="text-white text-xl" />}
            />
            <div className="space-y-4">
              <label
                className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed cursor-pointer hover:border-primary transition-colors"
                style={{ borderColor: `${COLORS.muted}40` }}
              >
                <FiUpload className="text-muted" />
                <span className="text-sm">
                  اختر ملفات أو اسحبها هنا (PDF, DOC, صور)
                </span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.attachments.map((file, index) => (
                  <motion.div
                    key={index}
                    className="p-3 rounded-lg flex items-center justify-between"
                    style={{ background: `${COLORS.muted}08` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FiPaperclip className="text-muted" />
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                    <button
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          attachments: prev.attachments.filter((_, i) => i !== index)
                        }))
                      }
                      className="text-danger hover:text-danger-dark"
                    >
                      <FiX />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="p-6">
            <SectionHeader
              title="المحتوى التعليمي"
              description="قم برفع الفيديوهات التعليمية للدورة"
              icon={<FiFilm className="text-white text-xl" />}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className="p-6 rounded-xl"
                style={{ background: `${COLORS.muted}08` }}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiVideo className="text-primary" />
                  إضافة فيديو جديد
                </h3>
                <div className="space-y-4">
                  <InputField
                    label="عنوان الفيديو"
                    isRequired
                    name="videoTitle"
                    value={formData.newVideo.title}
                    onUpdate={(name, value) =>
                      setFormData((prev) => ({
                        ...prev,
                        newVideo: { ...prev.newVideo, title: value }
                      }))
                    }
                  >
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg border border-gray-200"
                    />
                  </InputField>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <label
                        className="text-sm font-medium"
                        style={{ color: COLORS.secondary }}
                      >
                        رفع ملف الفيديو
                      </label>
                      <span className="text-danger">*</span>
                    </div>
                    <label
                      className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed cursor-pointer hover:border-primary transition-colors"
                      style={{ borderColor: `${COLORS.muted}40` }}
                    >
                      <FiUpload className="text-muted" />
                      <span className="text-sm truncate">
                        {formData.newVideo.fileName || "اختر ملف فيديو"}
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFormData((prev) => ({
                              ...prev,
                              newVideo: {
                                ...prev.newVideo,
                                file: file,
                                fileName: file.name,
                              },
                            }));
                          }
                        }}
                      />
                    </label>
                  </div>
                  <button
                    onClick={handleAddVideo}
                    className="w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all"
                    style={{
                      background: COLORS.primary,
                      color: COLORS.background,
                      opacity:
                        !formData.newVideo.title || !formData.newVideo.file
                          ? 0.6
                          : 1,
                    }}
                    disabled={
                      !formData.newVideo.title || !formData.newVideo.file
                    }
                  >
                    <FiPlus />
                    إضافة الفيديو
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {formData.videos.map((video, index) => (
                  <motion.div
                    key={index}
                    className="p-4 rounded-lg flex items-start gap-4"
                    style={{
                      background: COLORS.background,
                      border: `1px solid ${COLORS.muted}20`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <FiVideo className="text-xl text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{video.title}</h4>
                        <button
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              videos: prev.videos.filter((_, i) => i !== index),
                            }))
                          }
                          className="text-danger hover:text-danger-dark"
                        >
                          <FiX />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted">
                        <span className="flex items-center gap-1">
                          <FiClock /> {video.duration || "00:00"}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiFilm /> {video.fileName || `فيديو #${index + 1}`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8"
      style={{ background: COLORS.background }}
    >
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
          border: `1px solid ${COLORS.muted}20`,
        }}
      >
        <ProgressStepper />
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {error && (
                  <motion.div
                    className="mb-6 p-4 rounded-lg flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      background: `${COLORS.danger}10`,
                      color: COLORS.danger,
                    }}
                  >
                    <FiInfo className="text-xl" />
                    {error}
                  </motion.div>
                )}
                <StepContent />
              </motion.div>
            </AnimatePresence>
          </div>
          <div
            className="p-6 border-t"
            style={{ borderColor: `${COLORS.muted}20` }}
          >
            <div className="flex justify-between items-center">
              {activeStep > 1 && (
                <motion.button
                  type="button"
                  onClick={() => setActiveStep((prev) => prev - 1)}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2.5 rounded-lg flex items-center gap-2"
                  style={{
                    background: `${COLORS.muted}10`,
                    color: COLORS.secondary,
                  }}
                >
                  <FiArrowLeft />
                  السابق
                </motion.button>
              )}
              {activeStep < STEPS.length ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileHover={{ scale: 1.05 }}
                  className="ml-auto px-6 py-2.5 rounded-lg flex items-center gap-2"
                  style={{
                    background: COLORS.primary,
                    color: COLORS.background,
                    boxShadow: `0 4px 12px ${COLORS.primary}30`,
                  }}
                  disabled={!validateStep(activeStep)}
                >
                  التالي
                  <FiArrowLeft className="transform rotate-180" />
                </motion.button>
              ) : (
                <div className="ml-auto flex gap-4">
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-2.5 rounded-lg flex items-center gap-2"
                    style={{
                      background: COLORS.accent,
                      color: COLORS.secondary,
                      boxShadow: `0 4px 12px ${COLORS.accent}30`,
                    }}
                    disabled={isSubmitting || !validateAllSteps()}
                  >
                    {isSubmitting ? "جاري الإرسال..." : "إرسال للمراجعة"}
                    <FiSave />
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddCourseComponent; 