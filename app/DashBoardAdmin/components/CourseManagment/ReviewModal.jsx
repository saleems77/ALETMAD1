"use client";
import React, { useState, useEffect } from 'react';

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // ✅ المسار الصحيح مع Strapi 5
     const url = `/courses/${course.documentId}`;
    const fullUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;

    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          instructorShare: parseInt(formData.instructorShare),
          platformShare: parseInt(formData.platformShare),
          marketerShare: parseInt(formData.marketerShare)
        }
      })
    });

      if (!response.ok) {
        const errorData = await response.json();
      throw new Error(errorData.error?.message || 'فشل في تحديث الدورة');
      }

      const updatedCourse = await response.json();
     
    
    onClose();
  } catch (error) {
    console.error("Error updating course:", error);
    alert(error.message || "حدث خطأ أثناء تحديث الدورة");
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">تعديل نسب التوزيع</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">نسبة المدرب</label>
                <input
                  type="number"
                  name="instructorShare"
                  value={formData.instructorShare}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                {errors.instructorShare && (
                  <p className="text-red-500 text-sm mt-1">{errors.instructorShare}</p>
                )}
              </div>
              <div>
                <label className="block mb-1">نسبة المنصة</label>
                <input
                  type="number"
                  name="platformShare"
                  value={formData.platformShare}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                {errors.platformShare && (
                  <p className="text-red-500 text-sm mt-1">{errors.platformShare}</p>
                )}
              </div>
              <div>
                <label className="block mb-1">نسبة المسوق</label>
                <input
                  type="number"
                  name="marketerShare"
                  value={formData.marketerShare}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                {errors.marketerShare && (
                  <p className="text-red-500 text-sm mt-1">{errors.marketerShare}</p>
                )}
              </div>
            </div>

            {errors.total && (
              <p className="text-red-500 text-sm mt-2">{errors.total}</p>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                حفظ
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CourseFormModal; 