// components/courses/CourseFormModal.jsx
"use client";
import React, { useState, useEffect } from 'react';

const courseCategories = [
  "تكنولوجيا", "إدارة الأعمال", "اللغات", "التصميم", "التطوير الشخصي"
];

const CourseFormModal = ({ show, onClose, course, onSubmit }) => {
  const [formData, setFormData] = useState({
    instructorShare: course?.instructorShare || 70,
    platformShare: course?.platformShare || 20,
    marketerShare: course?.marketerShare || 10
  });
const [errors, setErrors] = useState({});
const validateForm = () => {
  const newErrors = {};
  const instructor = parseInt(formData.instructorShare);
  const platform = parseInt(formData.platformShare);
  const marketer = parseInt(formData.marketerShare);

  if (isNaN(instructor)) newErrors.instructorShare = "يجب إدخال رقم";
  else if (instructor < 0 || instructor > 100) newErrors.instructorShare = "النسبة يجب أن تكون بين 0 و 100";

  if (isNaN(platform)) newErrors.platformShare = "يجب إدخال رقم";
  else if (platform < 0 || platform > 100) newErrors.platformShare = "النسبة يجب أن تكون بين 0 و 100";

  if (isNaN(marketer)) newErrors.marketerShare = "يجب إدخال رقم";
  else if (marketer < 0 || marketer > 100) newErrors.marketerShare = "النسبة يجب أن تكون بين 0 و 100";

  if ((instructor + platform + marketer) !== 100) {
    newErrors.total = "إجمالي النسب يجب أن يكون 100%";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
  useEffect(() => {
    if (course) {
      setFormData({
        id: course.id,
        courseName: course.courseName,
        category: course.category,
        description: course.description,
        requirements: course.requirements,
        price: course.price,
        isFree: course.isFree,
        students: course.students,
        instructorShare: course.instructorShare,
        platformShare: course.platformShare,
        marketerShare: course.marketerShare,
        reviewStatus: course.reviewStatus
      });
    } else {
      resetForm();
    }
  }, [course]);

  const resetForm = () => {
    setFormData({
      id: null,
      courseName: '',
      category: 'تكنولوجيا',
      description: '',
      requirements: '',
      price: 0,
      isFree: false,
      students: 0,
      instructorShare: 70,
      platformShare: 20,
      marketerShare: 10,
      reviewStatus: 'Pending'
    });
  };

  const handleFieldChange = (e) => {
    alert("لا يمكن تعديل هذه الحقول");
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const instructor = parseInt(formData.instructorShare);
  const platform = parseInt(formData.platformShare);
  const marketer = parseInt(formData.marketerShare);

  // التحقق من أن القيم عددية
  if (isNaN(instructor) || isNaN(platform) || isNaN(marketer)) {
    alert("يرجى إدخال أرقام صحيحة فقط");
    return;
  }

  // التحقق من أن القيم ضمن النطاق الصحيح
  if (instructor < 0 || platform < 0 || marketer < 0) {
    alert("النسب لا يمكن أن تكون سالبة");
    return;
  }

  if (instructor > 100 || platform > 100 || marketer > 100) {
    alert("النسب لا يمكن أن تتجاوز 100%");
    return;
  }

  // التحقق من أن المجموع = 100%
  const total = instructor + platform + marketer;
  if (total !== 100) {
    alert("إجمالي النسب يجب أن يكون 100%");
    return;
  }

  try {
    const url = `/courses/${formData.id}`;
    const method =  "PUT" ;

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          courseName: formData.courseName,
          instructorShare: instructor,
          platformShare: platform,
          marketerShare: marketer
        }
      })
    });

    if (!response.ok) throw new Error("فشل حفظ الدورة");

    const savedCourse = await response.json();
    onSubmit(savedCourse);
    onClose();
  } catch (error) {
    console.error("Error saving course:", error);
    alert("حدث خطأ أثناء حفظ الدورة");
  }
};

   return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">تعديل نسب التوزيع</h3>
          <form onSubmit={handleSubmit}>
            {/* حقول النسب فقط */}
            <div className="grid grid-cols-3 gap-4">
  <div>
    <label>نسبة المدرب</label>
    <input
      type="number"
      value={formData.instructorShare}
      onChange={(e) => setFormData({...formData, instructorShare: e.target.value})}
    />
    {errors.instructorShare && <p className="text-red-500 text-sm">{errors.instructorShare}</p>}
  </div>
  <div>
    <label>نسبة المنصة</label>
    <input
      type="number"
      value={formData.platformShare}
      onChange={(e) => setFormData({...formData, platformShare: e.target.value})}
    />
    {errors.platformShare && <p className="text-red-500 text-sm">{errors.platformShare}</p>}
  </div>
  <div>
    <label>نسبة المسوق</label>
    <input
      type="number"
      value={formData.marketerShare}
      onChange={(e) => setFormData({...formData, marketerShare: e.target.value})}
    />
    {errors.marketerShare && <p className="text-red-500 text-sm">{errors.marketerShare}</p>}
  </div>
</div>
{errors.total && <p className="text-red-500 text-sm">{errors.total}</p>}

            {/* زر الحفظ فقط */}
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={onClose}>إلغاء</button>
              <button type="submit">حفظ</button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CourseFormModal;