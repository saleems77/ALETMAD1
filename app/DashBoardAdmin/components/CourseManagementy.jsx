// components/CourseManagement.jsx
'use client';
import { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const dummyCourses = [
  { id: 1, title: 'أساسيات البرمجة', category: 'تكنولوجيا', students: 245, status: 'نشط' },
  { id: 2, title: 'التسويق الرقمي', category: 'أعمال', students: 189, status: 'معلق' },
  { id: 3, title: 'التصميم الجرافيكي', category: 'فنون', students: 312, status: 'نشط' },
];

export default function CourseManagementy() {
  const [courses, setCourses] = useState(dummyCourses);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة الدورات</h2>
        <button className="btn-primary">
          <FiPlus className="ml-2" /> إضافة دورة
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">العنوان</th>
              <th className="p-3 text-right">التصنيف</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">الطلاب</th>
              <th className="p-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id} className="border-t">
                <td className="p-3">{course.title}</td>
                <td className="p-3">
                  <span className="badge">{course.category}</span>
                </td>
                <td className="p-3">
                  <span className={`status ${course.status === 'نشط' ? 'active' : 'inactive'}`}>
                    {course.status}
                  </span>
                </td>
                <td className="p-3">{course.students}</td>
                <td className="p-3 flex gap-2 justify-end">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FiEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}