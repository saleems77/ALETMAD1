"use client";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import qs from 'qs';
import ProtectedRoute from '../../../DashBoardAdmin/components/ProtectedRoute';
import CouponGenerator from './CouponGenerator';
import CouponList from './CouponList';
import InvitationLink from './InvitationLink';
import { FaBook, FaTag, FaLink, FaSearch, FaChevronRight, FaPlus } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function UserCoursesList() {
  const { user } = useSelector((state) => state.auth);
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

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
        id: course.documentId,
        name: course.courseName,
        price: course.price || 0
      }));

      setCourses(formattedCourses);
      setIsLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('خطأ في جلب الدورات:', err);
      setError(err.message);
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserCourses();
    }
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserCourses();
    toast.success('تم تحديث قائمة الدورات');
  };

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">إدارة الدورات التعليمية</h1>
              <p className="text-gray-600">تصفح وأدر دوراتك التعليمية من مكان واحد</p>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-70"
            >
              {refreshing ? (
                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FiRefreshCw />
              )}
              تحديث البيانات
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* قائمة الدورات */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-black flex items-center gap-2">
                  <FaBook className="text-blue-500" />
                  الدورات التي أنشأتها
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث عن دورة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* حالة التحميل */}
              {isLoading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl animate-pulse">
                      <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="p-6 text-center">
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
                    {error}
                  </div>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                  <p className="text-gray-600">لم تقم بإنشاء أي دورات بعد</p>
                  <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mx-auto">
                    <FaPlus />
                    إنشاء دورة جديدة
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredCourses.map(course => (
                    <div 
                      key={course.id}
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`p-6 cursor-pointer transition-all duration-200 flex justify-between items-center
                        ${selectedCourseId === course.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-black">{course.name}</h2>
                          {selectedCourseId === course.id && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              محددة
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-blue-600 font-medium flex items-center gap-1">
                          السعر: <span className="font-bold">{course.price}$</span>
                        </p>
                      </div>
                      <FaChevronRight className={`text-gray-400 ${selectedCourseId === course.id ? 'text-blue-500' : ''}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* أدوات الدورة المحددة */}
            <div>
              {selectedCourseId ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 bg-black text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FaBook className="text-yellow-400" />
                      أدوات الدورة المحددة
                    </h2>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="flex items-center bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <FaTag className="text-blue-500" />
                        <h3 className="ml-2 font-medium">إنشاء كوبون</h3>
                      </div>
                      <CouponGenerator courseId={selectedCourseId} />
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="flex items-center bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <FaTag className="text-blue-500" />
                        <h3 className="ml-2 font-medium">قائمة الكوبونات</h3>
                      </div>
                      <CouponList courseDocumentId={selectedCourseId} />
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="flex items-center bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <FaLink className="text-blue-500" />
                        <h3 className="ml-2 font-medium">رابط الدعوة</h3>
                      </div>
                      <InvitationLink courseDocumentId={selectedCourseId} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">اختر دورة</h3>
                  <p className="text-gray-600 mb-4">يرجى تحديد دورة من القائمة لعرض أدواتها</p>
                  <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">يمكنك إنشاء كوبونات وروابط دعوة وإدارة دوراتك</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}