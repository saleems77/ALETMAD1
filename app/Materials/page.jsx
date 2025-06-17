// app/materials/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import qs from 'qs';
import ProtectedRoute from '../DashBoardAdmin/components/ProtectedRoute';
import AddMaterialForm from './AddMaterialForm'; 

// دالة لجلب المواد التعليمية من Strapi
const fetchMaterialsByCourse = async (courseDocumentId, token, API_URL) => {
  const query = qs.stringify({
    filters: {
      course: {
        documentId: {
          $eq: courseDocumentId
        }
      }
    },
    populate: {
      attachment: {
        fields: ['name', 'url', 'size']
      }
    }
  }, { encodeValuesOnly: true });

  const response = await fetch(`${API_URL}/materials?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'فشل في جلب المواد.');
  }

  return await response.json();
};

export default function MaterialsPage() {
  // نسخة من UserCoursesList مع تعديل بسيط في الواجهة
  const { user } = useSelector((state) => state.auth);
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null); // حالة لتخزين الدورة المحددة
  const [materials, setMaterials] = useState([]);
  const [isMaterialsLoading, setIsMaterialsLoading] = useState(false);
  const [materialsError, setMaterialsError] = useState(null);

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
      
      const formattedCourses = data.data.map(course => ({
        id: course.id, // ID الرقمي يستخدم في العلاقات
        documentId: course.documentId,
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

  useEffect(() => {
    if (user) {
      fetchUserCourses();
    }
  }, [user]);

  // دالة لتحديث الدورة المحددة عند النقر
  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    setIsMaterialsLoading(true);
    setMaterialsError(null);
    
    try {
      const token = localStorage.getItem("jwt");
      const materialsData = await fetchMaterialsByCourse(course.documentId, token, API_URL);
      setMaterials(materialsData.data || []);
    } catch (err) {
      setMaterialsError(err.message);
    } finally {
      setIsMaterialsLoading(false);
    }
  };

  // دالة لتحويل الحجم إلى KB/MB
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* تخطيط مكونين جنب بعض باستخدام Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* قائمة الدورات */}
          <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">اختر دورة لإضافة مواد إليها</h1>            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-gray-100 rounded animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>
            ) : courses.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600">لم تقم بإنشاء أي دورات بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map(course => (
                  <div 
                    key={course.documentId} 
                    onClick={() => handleCourseSelect(course)}
                    className={`p-4 bg-white rounded-lg shadow-sm border transition-all cursor-pointer ${selectedCourse?.documentId === course.documentId ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:shadow-md'}`}
                  >
                    <h2 className="text-lg font-semibold text-black">{course.name}</h2>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* عرض فورم إضافة المواد فقط عند اختيار دورة */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            {selectedCourse ? (
              <>
                <AddMaterialForm courseId={selectedCourse.id} />

                {/* عرض المواد */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">المواد التعليمية</h3>
                  
                  {isMaterialsLoading ? (
                    <div className="animate-pulse">جاري التحميل...</div>
                  ) : materialsError ? (
                    <div className="text-red-600">{materialsError}</div>
                  ) : materials.length === 0 ? (
                    <div className="text-gray-500">لا توجد مواد لهذه الدورة.</div>
                  ) : (
                    <ul className="space-y-4">
                      {materials.map(material => (
                        <li key={material.id} className="border p-4 rounded shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <p><strong>الوصف:</strong> {material.description}</p>
                              <p><strong>السعر:</strong> ${material.price}</p>
                              
                              {material.attachment && material.attachment.length > 0 && (
                                <div className="mt-2">
                                  <p><strong>الملف:</strong> {material.attachment[0].name}</p>
                                  <p><strong>الحجم:</strong> {formatFileSize(material.attachment[0].size)}</p>
                                  <a 
                                    href={material.attachment[0].url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                  >
                                    📥 تنزيل الملف
                                  </a>
                                </div>
                              )}
                            </div>
                            
                            {/* عرض صورة معاينة إن وُجدت */}
                            {material.attachment && material.attachment[0].formats?.thumbnail?.url && (
                              <img 
                                src={material.attachment[0].formats.thumbnail.url} 
                                alt="معاينة" 
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">الرجاء اختيار دورة من القائمة أولاً.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}