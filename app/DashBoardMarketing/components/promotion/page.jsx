// app/dashboard/trainers/promotion/page.jsx
"use client"
import { Suspense } from 'react';
import React, { useState } from 'react';

import FeaturedTrainerBadge from './FeaturedTrainerBadge';
import PromotionPaymentModal from './/PromotionPaymentModal';
import SearchBoostManager from './SearchBoostManager';

export default function PromotionPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">تعزيز الظهور</h1>
        <FeaturedTrainerBadge isFeatured={isFeatured} />
      </div>

      <Suspense fallback={<div>جاري التحميل...</div>}>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          شراء باقة التميز
        </button>

        <SearchBoostManager />
      </Suspense>

      {showPaymentModal && (
        <PromotionPaymentModal 
          trainerId="123" 
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}