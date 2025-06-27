"use client";
import React, { useEffect, useState } from "react";
import AdCampaignManager from "./AdCampaignManager";
import AdStatusBadge from "./AdStatusBadge";
import { useToast } from "@/components/ui/use-toastt";

const CourseDetails = ({ course, onBack }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // وظيفة لتحويل التاريخ من "YYYY-MM-DD" إلى كائن Date بطريقة آمنة
  const parseDate = (dateString) => {
    if (!dateString) return null;
    
    // إضافة الوقت الافتراضي لتقليل احتمالية الأخطاء
    const safeDateString = dateString.includes("T") 
      ? dateString 
      : `${dateString}T00:00:00`;
      
    return new Date(safeDateString);
  };

  // وظيفة لتنسيق التاريخ للعرض
  const formatDate = (date) => {
    if (!date || isNaN(date.getTime())) return "تاريخ غير صالح";
    
    try {
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "خطأ في التاريخ";
    }
  };

  // تحميل الحملات الإعلانية المرتبطة بالكورس
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/campaigns?filters[course][documentId][$eq]=${course.id}`
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`فشل جلب الحملات الإعلانية - ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        
        // تحويل البيانات لتناسب ما يتوقعه المكون
        const transformedCampaigns = data.data?.map(campaign => ({
          id: campaign.documentId,
          ...campaign,
          // التأكد من معالجة التواريخ بشكل صحيح
          startDate: parseDate(campaign.startDate),
          endDate: parseDate(campaign.endDate),
         
        })) || [];
        
        setCampaigns(transformedCampaigns);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading campaigns:", error);
        toast({
          title: "❌ خطأ",
          description: `فشل تحميل الحملات الإعلانية: ${error.message}`,
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, [course.id]);

  // معالجة إنشاء حملة جديدة
  const handleCreateCampaign = async (newCampaign) => {
    try {
      const token = localStorage.getItem("jwt");
      
      // First upload the banner image if exists
      let bannerImageId = null;
      
      if (newCampaign.bannerImageFile) {
        const formData = new FormData();
        formData.append("files", newCampaign.bannerImageFile);
        
        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          }
        );
        
        if (!uploadResponse.ok) throw new Error("فشل تحميل الصورة");
        
        const uploadData = await uploadResponse.json();
        bannerImageId = uploadData[0]?.id;
      }
      
      // Create the campaign data
      const campaignData = {
        data: {
          title: newCampaign.title,
          description: newCampaign.description,
          budget: newCampaign.budget,
          startDate: newCampaign.startDate.toISOString(),
          endDate: newCampaign.endDate.toISOString(),
          status: "pending",
          course: newCampaign.courseId
        }
      };
      
      // If we have a banner image, add it to the campaign data
      if (bannerImageId) {
        campaignData.data.bannerImage = bannerImageId;
      }
      
      // Send request to create campaign
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/campaigns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(campaignData)
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || "فشل إنشاء الحملة");
      }
      
       await loadCampaigns(); // إعادة تحميل البيانات لعرض الحملة الجديدة
      
      toast({
        title: "🎉 تم إنشاء الحملة!",
        description: "الحملة تمت إضافتها بنجاح"
      });
    } catch (error) {
      toast({
        title: "❌ خطأ",
        description: error.message || "حدث خطأ أثناء إنشاء الحملة",
        variant: "destructive"
      });
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* رأس الصفحة */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
        >
          ← العودة إلى الكورسات
        </button>
        <h2 className="text-2xl font-bold">{course.title}</h2>
      </div>
      
      {/* تفاصيل الكورس */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">تفاصيل الكورس</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">العنوان</p>
            <p className="font-medium">{course.title}</p>
          </div>
          <div>
            <p className="text-gray-600">السعر</p>
            <p className="font-medium">{course.price} ر.س</p>
          </div>
        </div>
      </div>
      
      {/* قائمة الحملات الإعلانية */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">الحملات الإعلانية</h3>
        
        {campaigns.length > 0 ? (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div 
                key={campaign.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="mb-2 sm:mb-0">
                    <h4 className="font-bold text-lg">{campaign.title}</h4>
                    <div className="flex flex-col sm:flex-row sm:gap-4 mt-1">
                      <p className="text-sm text-gray-600">
                        من {formatDate(campaign.startDate)}
                      </p>
                      <p className="text-sm text-gray-600">
                        إلى {formatDate(campaign.endDate)}
                      </p>
                    </div>
                  </div>
                  <AdStatusBadge status={campaign.status} />
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-700">{campaign.description}</p>
                </div>
                
                {/* ميزانية الحملة */}
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    الميزانية: {campaign.budget} ر.س
                  </p>
                </div>
                
                {/* صورة البانر */}
                {campaign.bannerImage && (
                  <div className="mt-4">
                    <img 
                      src={campaign.bannerImage} 
                      alt={campaign.title}
                      className="max-h-40 rounded-md object-contain w-full sm:w-auto"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">لا توجد حملات إعلانية لهذا الكورس</p>
          </div>
        )}
      </div>
      
      {/* نموذج إنشاء حملة جديدة */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">إنشاء حملة جديدة</h3>
        <AdCampaignManager 
          onCreateCampaign={handleCreateCampaign} 
          courseId={course.id}
        />
      </div>
    </div>
  );
};

export default CourseDetails;