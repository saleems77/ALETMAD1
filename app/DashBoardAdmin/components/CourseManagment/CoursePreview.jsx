// CoursePreview.jsx
import React from 'react';

const CoursePreview = ({ show, onClose, course }) => {
  if (!show || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{course.courseName}</h2>
        
        {/* تفاصيل الدورة */}
        <div className="mb-6">
          <p><strong>الوصف:</strong> {course.description || "لا يوجد وصف"}</p>
          <p><strong>التصنيف:</strong> {course.category}</p>
          <p><strong>السعر:</strong> {course.price} ريال</p>
          <p><strong>عدد الطلاب:</strong> {course.students} طالب</p>
          <p><strong>المدرب:</strong> {course.users_permissions_user?.username || "غير محدد"}</p>
        </div>

        {/* توزيع الأرباح */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">توزيع الأرباح (%)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>المدرب: {course.instructorShare}%</div>
            <div>المنصة: {course.platformShare}%</div>
            <div>المسوق: {course.marketerShare}%</div>
          </div>
        </div>

        {/* المرفقات */}
        <div className="mb-6">
  <h3 className="font-medium mb-2">المرفقات</h3>
  {course.attachments?.length > 0 ? (
    course.attachments.map((file) => (
      <div key={file.id}>
        <a 
          href={file.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {file.name || `ملف ${file.id}`}
        </a>
      </div>
    ))
  ) : (
    <p>لا توجد مرفقات</p>
  )}
</div>

        {/* الفيديوهات */}
        <div className="mb-6">
  <h3 className="font-medium mb-2">الفيديوهات</h3>
  {course.videos?.length > 0 ? (
    course.videos.map((video) => (
      <div key={video.id} className="mb-4">
        <video 
          src={video.url} 
          controls 
          className="w-full mt-2 rounded shadow"
        />
      </div>
    ))
  ) : (
    <p>لا توجد فيديوهات</p>
  )}
</div>

        {/* زر التعديل */}
        <div className="flex justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            إغلاق
          </button>
          <button
  onClick={() => {
    window.dispatchEvent(new CustomEvent('openShareForm', { detail: course }));
    onClose();
  }}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  تعديل النسب فقط
</button>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;