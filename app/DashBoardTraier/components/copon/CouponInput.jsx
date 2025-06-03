"use client";
import { useState } from 'react';
import { validateCoupon } from './mocks/couponData';

const CouponInput = ({ onApply }) => {
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');

  const handleApply = () => {
    if (!couponCode.trim()) {
      setError('يرجى إدخال رمز الكوبون');
      return;
    }
    const isValid = validateCoupon(couponCode); // تحقق من صلاحية الكوبون
    if (isValid) {
      onApply(couponCode);
      setError('');
    } else {
      setError('رمز الكوبون غير صالح');
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="أدخل رمز الكوبون هنا..."
        className="p-2 border rounded-lg"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleApply}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        تطبيق الكوبون
      </button>
    </div>
  );
};

export default CouponInput;