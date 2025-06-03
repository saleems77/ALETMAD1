// components/MyCourses.jsx
"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect width="${w}" height="${h}" fill="#f3f4f6" />
  <path d="M0 0h48v1H0z" fill="rgba(209,213,219,0.3)" transform="translate(0 0.5)" />
</svg>`;

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
  `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/courses`,
  {
    params: {
      'filters[users_permissions_user][id]': user?.id,
      populate: {
        coverImage: { // يجب أن يكون هيكل populate هكذا
          fields: ['url'],
          populate: ['formats'] // للحصول على الصور المصغرة
        },
        track: { fields: ['name'] },
        users_permissions_user: { fields: ['username'] }
      }
    }
  }
);
        console.log('API Response:', response.data.data);
        setCourses(response.data.data);
      } catch (err) {
        setError('فشل في تحميل الدورات');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchCourses();
    }
  }, [user]);

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl p-6">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-10 bg-gray-200 rounded-lg mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">دوراتي</h1>
        <Link 
          href="/AddCourse"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          إضافة دورة جديدة
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
const coverImage = course.coverImage;
          return (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
  {coverImage ? (
   <Image
  src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${coverImage?.url}`}
  alt={course.courseName}
  width={400}
  height={300}
  className="object-cover w-full h-full"
  placeholder="blur"
  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 300))}`}
  unoptimized={process.env.NODE_ENV !== 'production'} // أضف هذا السطر للتطوير المحلي
/>
  ) : (
    <div className="w-full h-full bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center text-gray-400">
      <span className="text-sm">لا توجد صورة متاحة</span>
    </div>
  )}
</div>

              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                {course.courseName}
              </h2>

              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 rounded-full ${
                  course.isFree 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {course.isFree 
                    ? 'مجاني' 
                    : `$${course.price}`}
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={{
                    pathname: '/AddTest',
                    query: { 
                      courseId: course.id,
                      courseName: course.courseName 
                    }
                  }}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-center"
                >
                  إضافة اختبار
                </Link>

                <Link
                  href={`/Courses/manage/${course.id}`}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
                >
                  إدارة الدورة
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">لم تقم بإضافة أي دورات بعد</p>
        </div>
      )}
    </div>
  );
};

export default MyCourses;