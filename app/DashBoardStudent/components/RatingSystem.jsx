'use client';
import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

export default function RatingSystem({
  courseId,
  initialRating = 0,
  editable = true,
  size = 20,
}) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    if (!editable) return;
    setRating(value);
    // TODO: أرسل التقييم الجديد إلى الـ API هنا، مثلاً:
    // fetch(`/api/courses/${courseId}/rate`, { method: 'POST', body: JSON.stringify({ rating: value }) })
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const value = index + 1;
        const isActive = value <= (hover || rating);
        return (
          <button
            key={value}
            type="button"
            className="focus:outline-none"
            onClick={() => handleClick(value)}
            onMouseEnter={() => editable && setHover(value)}
            onMouseLeave={() => editable && setHover(0)}
          >
            {isActive ? (
              <FaStar size={size} className="text-yellow-400 transition-colors" />
            ) : (
              <FaRegStar size={size} className="text-gray-300 transition-colors" />
            )}
          </button>
        );
      })}
    </div>
  );
}
