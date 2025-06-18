"use client";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import qs from 'qs';
import ProtectedRoute from '../../../DashBoardAdmin/components/ProtectedRoute';
import CertificateSystem from "./CertificateSystem";

export default function CourseWithCertificatePage() {
  const { user } = useSelector((state) => state.auth);
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCertificateSystem, setShowCertificateSystem] = useState(false);

  // جلب دورات المستخدم
  const fetchUserCourses = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token || !user?.id) {
        throw new Error('يرجى تسجيل الدخول لعرض دوراتك');
      }

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('فشل جلب الدورات');

      const data = await response.json();
      
      // تنسيق الدورات
      const formattedCourses = data.data.map(course => ({
        id: course.documentId,
        name: course.courseName,
        price: course.price || 0
      }));
      
      setCourses(formattedCourses);
      setIsLoading(false);
    } catch (err) {
      console.error('خطأ في جلب الدورات:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  // تحميل الدورات عند تسجيل الدخول
  useEffect(() => {
    if (user) {
      fetchUserCourses();
    }
  }, [user]);

  // تحديد دورة
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setShowCertificateSystem(true);
  };

  // الرجوع إلى قائمة الدورات
  const handleBackToCourses = () => {
    setShowCertificateSystem(false);
    setSelectedCourse(null);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">دوراتك وشهاداتك</h1>
        
        {/* حالة التحميل */}
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-gray-100 rounded-lg animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-2/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded mb-6">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200 mb-6">
            <p className="text-gray-600">لم تقم بإنشاء أي دورات بعد</p>
          </div>
        ) : !showCertificateSystem && courses.length > 0 ? (
          <div className="space-y-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-black">دوراتك</h2>
                <p className="mt-2 text-gray-600">اختر دورة لعرض وإدارة الشهادات المرتبطة بها</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div 
                      key={course.id}
                      className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:border-blue-500 transition-all duration-300 cursor-pointer"
                      onClick={() => handleCourseSelect(course)}
                    >
                      <h3 className="font-medium text-gray-800">{course.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">السعر: {course.price} $</p>
                      <div className="mt-2">
                        <button 
                          className="text-blue-600 text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseSelect(course);
                          }}
                        >
                          إدارة الشهادات
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : selectedCourse && (
          <div>
            <div className="flex items-center mb-6">
              <button
                className="text-blue-600 hover:text-blue-800 flex items-center"
                onClick={handleBackToCourses}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L7.414 9H15a1 1 0 2 0 2-2v-2H7.414l2.293-2.293a1 1 0 0 1 0 1.414z" clipRule="evenodd" />
                </svg>
                الرجوع إلى الدورات
              </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="p-6 bg-blue-50 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-black">{selectedCourse.name}</h2>
                <div className="mt-2 flex flex-wrap">
                  <p className="text-blue-600 font-medium mr-4">السعر: {selectedCourse.price} $</p>
                  <p className="text-sm text-gray-500">Course ID: {selectedCourse.id}</p>
                </div>
              </div>
              <div className="p-6">
                {/* نظام الشهادات للدورة المحددة */}
                <CertificateSystem 
                  courseId={selectedCourse.id} 
                  courseName={selectedCourse.name}
                  onBackToCourses={handleBackToCourses}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}