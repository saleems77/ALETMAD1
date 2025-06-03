'use client';
import { useState } from 'react';
import RatingSystem from './RatingSystem';

export default function ReviewForm({ courseId, existingReview = null }) {
  const [review, setReview] = useState({
    rating: existingReview?.rating || 0,
    comment: existingReview?.comment || '',
    anonymous: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviews = JSON.parse(localStorage.getItem(`course-${courseId}-reviews`) || '[]');
    const newReview = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ...review
    };
    localStorage.setItem(
      `course-${courseId}-reviews`,
      JSON.stringify(existingReview 
        ? reviews.map(r => r.id === existingReview.id ? newReview : r) 
        : [...reviews, newReview])
    );
    alert(existingReview ? 'تم تحديث التقييم!' : 'شكراً لتقييمك!');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        {existingReview ? 'تعديل التقييم' : 'أضف تقييمك'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <RatingSystem 
          courseId={courseId}
          initialRating={review.rating}
          onChange={(newRating) => setReview({...review, rating: newRating})}
        />

        <textarea
          placeholder="شاركنا رأيك عن الدورة..."
          className="w-full p-3 border rounded-lg min-h-[100px]"
          value={review.comment}
          onChange={(e) => setReview({...review, comment: e.target.value})}
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={review.anonymous}
            onChange={(e) => setReview({...review, anonymous: e.target.checked})}
          />
          <span>نشر بشكل مجهول</span>
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {existingReview ? 'حفظ التعديلات' : 'نشر التقييم'}
        </button>
      </form>
    </div>
  );
}