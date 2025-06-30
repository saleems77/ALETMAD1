// AdCreator.jsx
"use client";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toastt";

const AdCreator = ({ adSetId, onSave }) => {
  const [ad, setAd] = useState({
    headline: "",
    description: "",
    cta: "تعلم المزيد",
    media: null,
    mediaPreview: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "❌ خطأ",
          description: "الملف غير مدعوم. الرجاء رفع صورة أو فيديو.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "❌ خطأ",
          description: "الملف كبير جداً. الرجاء رفع ملف أقل من 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setAd({
          ...ad,
          media: file,
          mediaPreview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("jwt");
      const formData = new FormData();
      
      // إضافة ملف الوسائط إذا كان موجودًا
      if (ad.media) {
        formData.append("files.media", ad.media);
      }
      
      // إضافة بيانات الإعلان
      formData.append("data", JSON.stringify({
        headline: ad.headline,
        description: ad.description,
        cta: ad.cta,
        adSet: adSetId
      }));
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/ads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) throw new Error("فشل إنشاء الإعلان");
      
      const data = await response.json();
      
      toast({
        title: "🎉 تم الإنشاء!",
        description: "تم إنشاء الإعلان بنجاح"
      });
      
      onSave(data);
      
      // إعادة تعيين النموذج
      setAd({
        headline: "",
        description: "",
        cta: "تعلم المزيد",
        media: null,
        mediaPreview: null
      });
    } catch (error) {
      toast({
        title: "❌ خطأ",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">إنشاء إعلان جديد</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">العنوان</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={ad.headline}
            onChange={(e) => setAd({...ad, headline: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">الوصف</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            value={ad.description}
            onChange={(e) => setAd({...ad, description: e.target.value})}
            required
          ></textarea>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">زر المطالبة بالإجراء (CTA)</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={ad.cta}
            onChange={(e) => setAd({...ad, cta: e.target.value})}
          >
            <option value="تعلم المزيد">تعلم المزيد</option>
            <option value="احجز مكانك">احجز مكانك</option>
            <option value="تحميل">تحميل</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">وسائط الإعلان</label>
          <div
            className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${
              ad.mediaPreview ? 'border-blue-300' : 'border-gray-300'
            }`}
            onClick={() => document.getElementById('ad-media-upload')?.click()}
          >
            {ad.mediaPreview ? (
              <div className="relative">
                <img
                  src={ad.mediaPreview}
                  alt="معاينة"
                  className="max-h-40 mx-auto"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAd({
                      ...ad,
                      media: null,
                      mediaPreview: null
                    });
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
            id="ad-media-upload"
            type="file"
            className="hidden"
            accept="image/*,video/*"
            onChange={handleImageUpload}
          />
        </div>
        
        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الإنشاء..." : "إنشاء إعلان"}
        </button>
      </form>
    </div>
  );
};

export default AdCreator;