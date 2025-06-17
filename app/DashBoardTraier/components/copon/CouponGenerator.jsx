"use client";
import { useState } from 'react';
import { generateCoupon } from '../../../../services/couponData';
import { toast } from 'react-hot-toast';
import { FaTag, FaMagic } from 'react-icons/fa';

const CouponGenerator = ({ courseId }) => {
  const [discount, setDiscount] = useState(10);
  const [expiry, setExpiry] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!expiry) {
      toast.error('يرجى تحديد تاريخ انتهاء الكوبون');
      return;
    }
    
    setIsGenerating(true);
    try {
      const coupon = await generateCoupon(courseId, discount, expiry);
      toast.success(`تم إنشاء الكوبون: ${coupon.data.code}`, {
        icon: '🎉',
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0'
        },
        duration: 3000
      });
    } catch (error) {
      toast.error('فشل إنشاء الكوبون', {
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca'
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">نسبة الخصم</label>
        <div className="relative">
          <input
            type="number"
            min="1"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-500 pl-12"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <span>%</span>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>1%</span>
          <span>100%</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">تاريخ الانتهاء</label>
        <div className="relative">
          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            جاري الإنشاء...
          </>
        ) : (
          <>
            <FaMagic />
            إنشاء كوبون جديد
          </>
        )}
      </button>
      
      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          ملاحظة
        </h4>
        <p className="text-yellow-700 mt-1 text-sm">
          سيتم إنشاء كود كوبون فريد تلقائياً بنسبة الخصم المحددة وتاريخ الانتهاء
        </p>
      </div>
    </div>
  );
};

export default CouponGenerator;