'use client';
import { useState } from 'react';
import CouponGenerator from './CouponGenerator';
import CouponUsageReport from './CouponUsageReport';
import CouponValidator from './CouponValidator';

const CouponDashboard = () => {
  const [coupons, setCoupons] = useState([]);

  const handleSaveCoupon = (coupon) => {
    setCoupons(prev => [...prev, coupon]);
  };

  return (
    <div className="space-y-6">
      <CouponGenerator onSaveCoupon={handleSaveCoupon} />
      <CouponUsageReport coupons={coupons} />
      <CouponValidator coupons={coupons} />
    </div>
  );
};

export default CouponDashboard;
