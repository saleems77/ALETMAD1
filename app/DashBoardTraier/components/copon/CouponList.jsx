"use client"
import { useState, useEffect } from 'react';
import { getCoupons } from './mocks/couponData';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCoupons(getCoupons());
  }, []);

  // فلترة الكوبونات بالبحث
  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="ابحث عن كوبون..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border rounded-lg w-64"
        />
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-right">رمز الكوبون</th>
            <th className="p-3 text-right">الخصم</th>
            <th className="p-3 text-right">تاريخ الانتهاء</th>
          </tr>
        </thead>
        <tbody>
          {filteredCoupons.map(coupon => (
            <tr key={coupon.id} className="hover:bg-gray-50">
              <td className="p-3">{coupon.code}</td>
              <td className="p-3">{coupon.discount}%</td>
              <td className="p-3">{coupon.expiresAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponList;