"use client"
import { useState } from 'react';
import { generateCoupon } from './mocks/couponData';
import { toast } from 'react-hot-toast';

const CouponGenerator = () => {
  const [discount, setDiscount] = useState(10);
  const [expiry, setExpiry] = useState('');

  const handleGenerate = () => {
    const coupon = generateCoupon(discount, expiry);
    toast.success(`تم إنشاء الكوبون: ${coupon.code}`);
    // تحديث قائمة الكوبونات تلقائيًا (يمكن استخدام Context أو State Management)
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm space-y-4">
      <div>
        <label className="block mb-2">نسبة الخصم</label>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="p-3 border rounded-lg w-full"
        />
      </div>
      <div>
        <label className="block mb-2">تاريخ الانتهاء</label>
        <input
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="p-3 border rounded-lg w-full"
        />
      </div>
      <button
        onClick={handleGenerate}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        إنشاء كوبون جديد
      </button>
    </div>
  );
};

export default CouponGenerator;