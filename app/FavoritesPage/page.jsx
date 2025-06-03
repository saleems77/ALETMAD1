'use client';

import React, { useState } from 'react';

const FavoritesPage = () => {
  // قائمة افتراضية للدورات المفضلة (يمكن استبدالها ببيانات حقيقية لاحقاً)
  const [favoriteCourses, setFavoriteCourses] = useState([
    { id: 1, courseName: 'الدورة الأولى' },
    { id: 2, courseName: 'الدورة الثانية' }
  ]);

  // دالة لتبديل حالة الإضافة/الإزالة من المفضلة
  const toggleFavorite = (courseId) => {
    setFavoriteCourses((prevFavorites) => {
      // إذا كانت الدورة موجودة في المفضلة، قم بحذفها
      if (prevFavorites.find((course) => course.id === courseId)) {
        return prevFavorites.filter((course) => course.id !== courseId);
      }
      // وإلا، قم بإضافتها (هنا نقوم بإضافة بيانات تجريبية، يمكن استبدالها ببيانات فعلية)
      return [...prevFavorites, { id: courseId, courseName: `الدورة ${courseId}` }];
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">المفضلة</h1>
      {favoriteCourses.length > 0 ? (
        <ul className="space-y-4">
          {favoriteCourses.map((course) => (
            <li
              key={course.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <span className="text-lg">{course.courseName}</span>
              <button
                onClick={() => toggleFavorite(course.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                إزالة من المفضلة
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">لا توجد دورات مفضلة بعد</p>
      )}
    </div>
  );
};

export default FavoritesPage;
