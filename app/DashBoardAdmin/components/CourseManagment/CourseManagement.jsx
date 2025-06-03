// components/courses/CourseManagement.jsx
"use client";
import React, { useState ,useEffect  } from "react";
import CourseFormModal from "./CourseFormModal";
import ReviewModal from "./ReviewModal";
import CoursePreview from "./CoursePreview";
import { useRouter } from "next/navigation";
import { getStrapiData, postStrapiData } from '@/lib/strapi';

const reviewStatusOptions = [
  { value: "all", label: "جميع الحالات" },
  { value: "Pending", label: "قيد المراجعة" },
  { value: "Approved", label: "مقبولة" },
  { value: "Rejected", label: "مرفوضة" }
];

const CourseManagement = ({ initialCourses = [], onUpdate, onDelete }) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const router = useRouter();
   const [courses, setCourses] = useState(initialCourses);

  // تصفية الدورات حسب الحالة
  const filteredCourses = courses.filter((course) =>
    selectedStatus === "all" 
      ? true 
      : course.reviewStatus === selectedStatus
  );

  const handleReviewCourse = (course) => {
    setSelectedCourse(course);
    setShowReviewModal(true);
  };
  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const data = await getStrapiData('/courses?populate=deep,3');
      setCourses(data.data || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  fetchCourses();
}, []);
useEffect(() => {
  const handleOpenShareForm = (e) => {
    const course = e.detail;
    setSelectedCourse(course);
    setShowForm(true);
  };
  window.addEventListener('openShareForm', handleOpenShareForm);
  return () => window.removeEventListener('openShareForm', handleOpenShareForm);
}, []);
 const handleApproveOrReject = async (courseId, reviewStatus, rejectionReason = "") => {
  try {
    const updatedCourse = await postStrapiData(`/api/courses/${courseId}`, {
      reviewStatus,
      rejectionReason
    });
    
    onUpdate(updatedCourse);
    setShowReviewModal(false);
  } catch (error) {
    console.error("Error updating course status:", error);
    alert("حدث خطأ أثناء تحديث حالة الدورة");
  }
};

  const handlePreviewCourse = (course) => {
    setSelectedCourse(course);
    setShowPreview(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* رأس الجدول */}
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold">إدارة الدورات</h3>
        <div className="flex items-center space-x-4">
          <select
            className="p-2 border rounded"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {reviewStatusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              setSelectedCourse(null);
              setShowForm(true);
            }}
          >
            إضافة دورة
          </button>
        </div>
      </div>

      {/* جدول العرض */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right">العنوان</th>
              <th className="px-6 py-3 text-right">المدرب</th>
              <th className="px-6 py-3 text-right">حالة المراجعة</th>
              <th className="px-6 py-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4">{course.courseName}</td>
                  <td className="px-6 py-4">
                    {course.users_permissions_user?.username || 'Unknown Instructor'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        course.reviewStatus === "Approved"
                          ? "bg-green-100 text-green-800"
                          : course.reviewStatus === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {course.reviewStatus === "Approved" ? "مقبولة" : 
                       course.reviewStatus === "Rejected" ? "مرفوضة" : "قيد المراجعة"}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handlePreviewCourse(course)}
                    >
                      معاينة
                    </button>
                    <button
                      className="text-purple-600 hover:text-purple-800"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowForm(true);
                      }}
                    >
                      تعديل
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => handleReviewCourse(course)}
                    >
                      مراجعة
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        if (window.confirm("هل أنت متأكد من حذف هذه الدورة؟")) {
                          onDelete(course.id);
                        }
                      }}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  لا توجد دورات متاحة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* المكونات المنبثقة */}
      {showForm && (
        <CourseFormModal
          show={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedCourse(null);
          }}
          course={selectedCourse}
          onSubmit={onUpdate}
        />
      )}

      {showReviewModal && (
        <ReviewModal
          show={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          course={selectedCourse}
          onSubmit={handleApproveOrReject}
        />
      )}

      {showPreview && (
        <CoursePreview
          show={showPreview}
          onClose={() => setShowPreview(false)}
          course={selectedCourse}
        />
      )}
    </div>
  );
};

export default CourseManagement;