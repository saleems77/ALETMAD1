"use client";
import React, { useEffect, useState } from "react";
import CourseManagement from "./CourseManagement";
import { getStrapiData,postStrapiData  } from '@/lib/strapi'; // ✅ التأكد من هذا السطر
import { toast, ToastContainer } from 'react-toastify'; // ✅ استيراد مكتبة الرسائل
import 'react-toastify/dist/ReactToastify.css'; // ✅ استيراد أنماط الرسائل
export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // ✅ حالة التحديث

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // ✅ استخدام getStrapiData بدلاً من fetch
        const data = await getStrapiData('/courses?populate=*');
        setCourses(data.data || []);
      } catch (error) {
        console.error("فشل في جلب الدورات:", error);
        alert("تعذر تحميل الدورات. يرجى المحاولة لاحقًا.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

   const handleUpdate = async (updatedCourse) => {
        setIsUpdating(true); // ✅ بدء مؤشر التحميل

     try {
    await postStrapiData(`/courses/${updatedCourse.documentId}`, {
      data: {
        instructorShare: parseInt(updatedCourse.instructorShare),
        platformShare: parseInt(updatedCourse.platformShare),
        marketerShare: parseInt(updatedCourse.marketerShare)
      }
    });
        const updatedData = response.data || response;

       setCourses(prev => prev.map(c => 
      c.documentId === updatedCourse.documentId ? { 
        ...c, 
        ...updatedData,
        id: updatedData.id
      } : c
    ));      toast.success("تم تحديث النسب المالية بنجاح!");

  } catch (error) {
    console.error("Failed to update course:", error);
    alert(error.message || "حدث خطأ أثناء تحديث الدورة");
  }finally {
      setIsUpdating(false); // ✅ إيقاف مؤشر التحميل
    }
};

  const handleDelete = async (documentId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/courses/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to delete course');

    setCourses(prev => prev.filter(c => c.documentId !== documentId));
          toast.success("تم حذف الدورة بنجاح!");

  } catch (error) {
    console.error("Failed to delete course:", error);
    alert(error.message || "حدث خطأ أثناء حذف الدورة");
  }
};

  if (isLoading) return <div className="text-center py-8">جاري التحميل...</div>;

   return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* ✅ مؤشر التحميل أثناء التحديث */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
              <span className="text-lg">جاري تحديث البيانات...</span>
            </div>
          </div>
        </div>
      )}
      
      <h1 className="text-3xl font-bold mb-6">إدارة الدورات</h1>
      <CourseManagement 
        courses={courses} 
        onUpdate={handleUpdate} 
        onDelete={handleDelete} 
      />
      
      {/* ✅ عنصر الرسائل */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}