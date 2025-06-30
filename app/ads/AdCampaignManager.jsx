"use client";
import React, { forwardRef, useState } from "react";
import { useToast } from "@/components/ui/use-toastt";

const AdCampaignManager = forwardRef(({ onCreateCampaign, courseId }, ref) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    startDate: new Date(),
    endDate: new Date(),
    bannerImageFile: null,
    bannerImagePreview: null,
    courseId: courseId || ""
  });
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "⚠️ حجم كبير جداً",
          description: "حجم الصورة يجب ألا يتجاوز 5 MB",
          variant: "destructive",
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

  const validateForm = () => {
  const newErrors = {};
  
  if (!formData.title.trim()) {
    newErrors.title = "عنوان الحملة مطلوب";
  }
  
  if (!formData.description.trim()) {
    newErrors.description = "وصف الحملة مطلوب";
  }
  
  if (!formData.budget || formData.budget < 100) {
    newErrors.budget = "الميزانية يجب أن تكون 100 ر.س على الأقل";
  }
  
  if (!formData.bannerImageFile) {
    newErrors.bannerImage = "يجب تحميل صورة البانر";
  }
  
  if (formData.endDate < formData.startDate) {
    newErrors.dates = "تاريخ النهاية يجب أن يكون بعد تاريخ البداية";
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form...");
    
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Calling onCreateCampaign with data:", formData);
      
      // Add course ID to the campaign
      const campaignData = {
        ...formData,
        courseId: formData.courseId
      };
      
      await onCreateCampaign(campaignData);
      
      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        budget: "",
        startDate: new Date(),
        endDate: new Date(),
        bannerImageFile: null,
        bannerImagePreview: null,
        courseId: formData.courseId
      });
      
      toast({
        title: "🎉 تم إنشاء الحملة!",
        description: "تمت إضافة الحملة الجديدة بنجاح",
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "❌ خطأ",
        description: "حدث خطأ أثناء إنشاء الحملة",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" ref={ref}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">عنوان الحملة</label>
          <input
            type="text"
            className={`w-full p-2 border rounded ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">الميزانية اليومية (ر.س)</label>
          <input
            type="number"
            min="100"
            className={`w-full p-2 border rounded ${
              errors.budget ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
          />
          {errors.budget && (
            <p className="text-red-500 text-sm">{errors.budget}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">وصف الحملة</label>
        <textarea
          className="w-full p-2 border rounded"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows="3"
        ></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">تاريخ البداية</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={formData.startDate.toISOString().split('T')[0]}
            onChange={(e) => setFormData({...formData, startDate: new Date(e.target.value)})}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">تاريخ النهاية</label>
          <input
            type="date"
            className={`w-full p-2 border rounded ${errors.dates ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.endDate.toISOString().split('T')[0]}
            min={formData.startDate.toISOString().split('T')[0]}
            onChange={(e) => setFormData({...formData, endDate: new Date(e.target.value)})}
          />
          {errors.dates && (
            <p className="text-red-500 text-sm">{errors.dates}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">البانر الإعلاني</label>
        <div 
          className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${
            formData.bannerImagePreview ? 'border-blue-300' : 'border-gray-300'
          }`}
          onClick={() => document.getElementById('banner-upload')?.click()}
        >
          {formData.bannerImagePreview ? (
            <div className="relative">
              <img 
                src={formData.bannerImagePreview} 
                alt="Preview" 
                className="max-h-40 mx-auto"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute top-0 right-0 text-red-500"
              >
                ×
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500">انقر للرفع أو اسحب الملف هنا</p>
              <p className="text-xs text-gray-400 mt-1">الحجم الأقصى: 5 MB</p>
            </div>
          )}
        </div>
        <input
          id="banner-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
      <button
        type="submit"
        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "جاري إنشاء الحملة..." : "إنشاء حملة"}
      </button>
    </form>
  );
});

AdCampaignManager.displayName = "AdCampaignManager";
export default AdCampaignManager;
