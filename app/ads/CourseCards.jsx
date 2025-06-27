"use client"
import React from 'react';

const CourseCards = ({ courses, onSelectCourse }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {courses.map(course => (
        <div 
          key={course.id} 
          className="border rounded-lg p-4 hover:shadow-md cursor-pointer"
          onClick={() => onSelectCourse(course)}
        >
          <h3 className="font-bold text-lg mb-2">{course.title}</h3>
          <p className="text-gray-600 mb-1">السعر: {course.price} ر.س</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
            عرض التفاصيل
          </button>
        </div>
      ))}
    </div>
  );
};

export default CourseCards;
