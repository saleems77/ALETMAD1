"use client";
import React, { useState } from 'react';

const ReviewModal = ({ show, onClose, course, onSubmit }) => {
  const [reviewStatus, setReviewStatus] = useState(course?.reviewStatus || 'Pending');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(course.id, reviewStatus, rejectionReason);
    onClose();
  };

  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">مراجعة الدورة: {course.courseName}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label>حالة المراجعة</label>
              <select
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value)}
              >
                <option value="Pending">قيد المراجعة</option>
                <option value="Approved">مقبولة</option>
                <option value="Rejected">مرفوضة</option>
              </select>
            </div>

            {reviewStatus === "Rejected" && (
              <div className="mb-4">
                <label>سبب الرفض</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                />
              </div>
            )}

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

export default ReviewModal;