// app/courses/page.js
"use client";
import React, { useEffect, useState } from "react";
import CourseManagement from "./CourseManagement";
import { getStrapiData } from '@/lib/strapi'; // ✅ التأكد من هذا السطر
export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getStrapiData('/courses?populate=*');
        setCourses(data.data || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleUpdate = async (updatedCourse) => {
  try {
    const updatedList = await postStrapiData(`/courses/${updatedCourse.id}`, updatedCourse.data);
    const updatedCourses = courses.map((c) =>
      c.id === updatedCourse.id ? updatedList.data : c
    );
    setCourses(updatedCourses);
  } catch (error) {
    console.error("Failed to update course:", error);
    alert("حدث خطأ أثناء تحديث الدورة");
  }
};

  const handleDelete = async (courseId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete course');

      const updatedList = await getStrapiData('/courses?populate=*');
      setCourses(updatedList.data || []);
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">إدارة الدورات</h1>
      <CourseManagement 
        courses={courses} 
        onUpdate={handleUpdate} 
        onDelete={handleDelete} 
      />
    </div>
  );
}