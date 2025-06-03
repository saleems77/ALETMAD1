"use client"
// components/dashboard/CourseManagement.jsx
import { useState } from 'react';
import { ProgressBar } from './ProgressBar'; // مكون تقدم مخصص

// بيانات افتراضية للدورات
const coursesData = [
  {
    id: 1,
    title: "الرياضيات الأساسية",
    instructor: "أحمد محمد",
    progress: 65,
    students: 142,
    content: [
      { type: "فيديو", title: "المقدمة", duration: "15 دقيقة", completed: true },
      { type: "ملف", title: "تمارين الوحدة الأولى", duration: "30 دقيقة", completed: false },
      { type: "اختبار", title: "اختبار قصير", duration: "10 دقائق", completed: false }
    ],
    stats: {
      completedTasks: 8,
      avgScore: 78,
      activeStudents: 92
    }
  },
  {
    id: 2,
    title: "أساسيات البرمجة",
    instructor: "ليلى عبدالله",
    progress: 40,
    students: 89,
    content: [
      { type: "فيديو", title: "مقدمة في الخوارزميات", duration: "20 دقيقة", completed: true },
      { type: "مشروع", title: "مشروع بسيط", duration: "2 ساعة", completed: false }
    ],
    stats: {
      completedTasks: 5,
      avgScore: 82,
      activeStudents: 67
    }
  }
];

const CourseCard = ({ course, isSelected, onClick }) => (
  <div 
    className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
      isSelected ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-white hover:bg-gray-50'
    }`}
    onClick={onClick}
  >
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
        <p className="text-sm text-gray-600 mt-1">المدرب: {course.instructor}</p>
      </div>
      <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
        {course.progress}% مكتمل
      </span>
    </div>
    
    <div className="mt-4">
      <ProgressBar value={course.progress} />
    </div>
    
    <div className="flex items-center justify-between mt-4 text-sm">
      <div className="flex items-center">
        👥 {course.students} طالب
      </div>
      <div className={`px-2 py-1 rounded-lg ${
        course.progress === 100 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {course.progress === 100 ? 'مكتملة' : 'قيد التقدم'}
      </div>
    </div>
  </div>
);

const ContentItem = ({ item }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${
        item.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100'
      }`}>
        {item.type === 'فيديو' ? '🎥' : item.type === 'اختبار' ? '📝' : '📁'}
      </div>
      <div>
        <h4 className="font-medium text-gray-800">{item.title}</h4>
        <p className="text-sm text-gray-500">{item.duration}</p>
      </div>
    </div>
    {item.completed ? (
      <span className="text-green-600">✓ مكتمل</span>
    ) : (
      <button className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg">
        ابدأ الآن
      </button>
    )}
  </div>
);

const CourseManagement = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">إدارة الدورات</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* قائمة الدورات */}
        <div className="lg:col-span-1 space-y-4">
          {coursesData.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              isSelected={selectedCourse?.id === course.id}
              onClick={() => setSelectedCourse(course)}
            />
          ))}
        </div>

        {/* تفاصيل الدورة */}
        {selectedCourse && (
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">{selectedCourse.title}</h2>
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* الإحصائيات */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">المهام المكتملة</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {selectedCourse.stats.completedTasks}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">متوسط النتائج</p>
                  <p className="text-2xl font-bold text-green-800">
                    {selectedCourse.stats.avgScore}%
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">طلاب نشطين</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {selectedCourse.stats.activeStudents}
                  </p>
                </div>
              </div>

              {/* محتوى الدورة */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">جدول المحتوى</h3>
                {selectedCourse.content.map((item, index) => (
                  <ContentItem key={index} item={item} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;