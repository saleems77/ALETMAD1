'use client';
import { FaStar } from 'react-icons/fa';

const FeaturedTrainerBadge = ({ isFeatured }) => {
  if (!isFeatured) return null;
  
  return (
    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-sm">
      <FaStar className="w-4 h-4" />
      <span>مميز</span>
    </div>
  );
};

export default FeaturedTrainerBadge;
