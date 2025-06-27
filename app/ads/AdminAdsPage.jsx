"use client";
import React, { useState, useEffect } from "react";
import CourseCards from "./CourseCards";
import CourseDetails from "./CourseDetails";
import { useToast } from "@/components/ui/use-toastt";
import qs from "qs";
import Link from "next/link";
const AdminAdsPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // تحميل بيانات المستخدم
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("فشل تحميل بيانات المستخدم");
        setUser(await response.json());
      } catch (error) {
        toast({
          title: "❌ خطأ",
          description: "فشل تحميل بيانات المستخدم",
          variant: "destructive",
        });
      }
    };
    loadUser();
  }, []);

  // تحميل كورسات المستخدم
  useEffect(() => {
    if (!user) return;
    const loadCourses = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const query = qs.stringify({
          filters: { users_permissions_user: { id: { $eq: user.id } } },
          fields: ["courseName", "price", "documentId"],
        });
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/courses?${query}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("فشل جلب الدورات");
        const { data } = await response.json();
        setCourses(
          data.map((course) => ({
            id: course.documentId,
            title: course.courseName,
            price: course.price || 0,
          }))
        );
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "❌ خطأ",
          description: "فشل جلب دوراتك",
          variant: "destructive",
        });
      }
    };
    loadCourses();
  }, [user]);

  // Function to create a new campaign
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
      
      const { data } = await response.json();
      
      // Update local state
      setCampaigns(prev => [...prev, {
        id: data.documentId,
        ...data.attributes,
        bannerImage: data.attributes.bannerImage?.data?.url || null
      }]);
      
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

  if (isLoading) return <div>جاري التحميل...</div>;
 if (courses.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-white rounded-lg shadow p-8 max-w-md mx-auto mt-12">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            لا تمتلك أي دورات مسجلة
          </h3>
          <p className="text-gray-600 mb-6">
            لم تقم بإضافة أي دورات بعد. يرجى إضافة دورة جديدة لبدء إنشاء الحملات
            الإعلانية.
          </p>
          <Link href="./AddCourse">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300">
              إضافة دورة جديدة
            </button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-6 space-y-8">
      {!selectedCourse && courses.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-8 mb-4">دوراتك</h2>
          <CourseCards courses={courses} onSelectCourse={setSelectedCourse} />
        </>
      )}
      {selectedCourse && (
        <CourseDetails
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
          onCreateCampaign={handleCreateCampaign}
        />
      )}
    </div>
  );
};

export default AdminAdsPage;
