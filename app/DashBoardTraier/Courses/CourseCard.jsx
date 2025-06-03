"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { StarRating, DetailItem, ClockIcon, CheckCircleIcon } from './Helpers';
import CourseActionsDropdown from './CourseActionsDropdown';

const CourseCard = ({ 
  course, 
  isFavorite, 
  onToggleFavorite, 
  onEdit, 
  onDelete 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const discountedPrice = course?.discount 
  ? course.price - (course.price * course.discount / 100)
  : null;

  const handleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite(course.id);
  };

  return (
    <motion.div 
      className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      {/* الأيقونات العلوية */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {course.discount && (
          <div className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">
            {course.discount}% خصم
          </div>
        )}
        {course.certificate && (
          <div className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
            شهادة
          </div>
        )}
      </div>

      {/* زر المفضلة */}
      <button
        onClick={handleFavorite}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
      >
        <motion.svg
          className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
          viewBox="0 0 24 24"
          initial={{ scale: 1 }}
          animate={{ scale: isFavorite ? [1, 1.2, 1] : 1 }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </motion.svg>
      </button>

      {/* صورة الدورة */}
      <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
        <Image
          src={course.image}
          alt={course.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30" />
      </div>

      {/* محتوى البطاقة */}
      <div className="p-5">
        <h3 className="font-bold text-xl text-gray-900 mb-3">
          {course.name}
        </h3>
        
        {/* السعر */}
        <div className="flex items-center gap-3 mb-4">
          {discountedPrice ? (
            <>
              <span className="text-2xl font-bold text-red-600">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="line-through text-gray-400">
                ${course.price}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              ${course.price}
            </span>
          )}
        </div>

        {/* معلومات إضافية */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <StarRating rating={course.rating} />
            <span>{course.rating}</span>
          </div>
          <span className="flex items-center gap-1">
            <ClockIcon />
            {course.duration}
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md">
            {course.level}
          </span>
        </div>
      </div>

      {/* تفاصيل عند الhover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="absolute inset-0 bg-white rounded-2xl shadow-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-xl">تفاصيل الدورة</h4>
              <CourseActionsDropdown
                onEdit={onEdit}
                onDelete={() => onDelete(course.id)}
              />
            </div>
            
            <p className="text-gray-600 mb-6">{course.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <DetailItem label="المدرب" value={course.instructor} />
              <DetailItem label="الطلاب" value={course.studentsEnrolled?.toLocaleString()} />
              <DetailItem label="اللغة" value={course.language} />
              <DetailItem label="المشاريع" value={course.projects} />
            </div>

            {course.prerequisites && (
              <div className="mb-6">
                <h5 className="text-gray-500 font-medium mb-3">المتطلبات:</h5>
                <ul className="space-y-2">
                  {course.prerequisites.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircleIcon className="text-green-500" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold"
            >
              {course.certificate ? 'سجل للحصول على الشهادة' : 'سجل الآن'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CourseCard;