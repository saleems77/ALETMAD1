// app/courses/CoursePreview.jsx
import React, { useState, useEffect } from 'react';

const CoursePreview = ({ show, onClose, course }) => {
  if (!show || !course) return null;

  // دالة لتحويل الرابط النسبي من Strapi إلى رابط كامل
  const getFullUrl = (relativePath) => {
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${relativePath}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* عنوان الكورس */}
        <h2 className="text-2xl font-bold mb-4">{course.courseName}</h2>

        {/* التفاصيل الأساسية */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>الفئة التعليمية:</strong> {course.track?.name || "غير محددة"}</p>
          <p><strong>السعر:</strong> {course.price} $</p>
          <p><strong>عدد الطلاب:</strong> {course.students || 0} طالب</p>
          <p><strong>المدرب:</strong> {course.users_permissions_user?.username || "غير محدد"}</p>
          <p><strong>الحالة:</strong> 
            {course.reviewStatus === "Approved" ? "مقبولة" : 
             course.reviewStatus === "Rejected" ? "مرفوضة" : "قيد المراجعة"}
          </p>
          {course.rejectionReason && course.reviewStatus === "Rejected" && (
            <p><strong>سبب الرفض:</strong> {course.rejectionReason}</p>
          )}
          <p><strong>المتطلبات المسبقة:</strong> {course.requirements || "لا توجد متطلبات"}</p>
          <p><strong>جمهور المستهدف:</strong> {course.targetAudience || "غير محدد"}</p>
          <p><strong>تعليمات الوصول:</strong> {course.accessInstructions || "غير محددة"}</p>
          <p><strong>مجانية ؟:</strong> {course.isFree ? "نعم" : "لا"}</p>
          <p><strong>هل يحتوي على اختبار دخول؟</strong> {course.hasEntryTest ? "نعم" : "لا"}</p>
          <p><strong>تاريخ الإنشاء:</strong> {new Date(course.createdAt).toLocaleDateString()}</p>
          <p><strong>آخر تحديث:</strong> {new Date(course.updatedAt).toLocaleDateString()}</p>
        </div>

        {/* أهداف الدورة */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">أهداف الدورة</h3>
          <p>{course.learningObjectives || "لا توجد أهداف محددة"}</p>
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
          {course.attachments && course.attachments.length > 0 ? (
            course.attachments.map((file) => (
              <div key={file.id} className="mb-2">
                <a 
                  href={getFullUrl(file.url)} 
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
          {course.videos && course.videos.length > 0 ? (
            course.videos.map((video) => (
              <div key={video.id} className="mb-6 border rounded p-4">
                <h4 className="font-semibold mb-2">{video.title || `فيديو ${video.id}`}</h4>
                <div className="mb-2">
                  <video 
                    src={getFullUrl(video.url)} 
                    //يجب ان اجد طريقة لتخزين اسم مقطع الفيديو ليس الذي ادخلناه نحن .. ونيفه الى الرابط الاساسي ليتم عرص الفيديو و تصفحه كما في هذه الحالة  http://localhost:1337/uploads/Facebook_2273792813011817_360p_ca4fd8c25d.mp4
                    controls 
                    className="w-full mt-2 rounded shadow"
                    onLoadedMetadata={(e) => {
                      const duration = Math.floor(e.target.duration);
                      const minutes = Math.floor(duration / 60);
                      const seconds = duration % 60;
                      video.duration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                    }}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>المدة:</strong> {video.duration || "جاري التحميل..."}</p>
                </div>
              </div>
            ))
          ) : (
            <p>لا توجد فيديوهات</p>
          )}
        </div>

        {/* زر الإغلاق */}
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-black rounded hover:bg-gray-700 transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;