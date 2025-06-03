'use client';
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { RefreshCw, QrCode } from 'lucide-react';
import Swal from 'sweetalert2';

const CouponGenerator = ({ onSaveCoupon }) => {
  const [coupon, setCoupon] = useState({
    code: '',
    discount: 10,
    maxUses: 100,
    validUntil: new Date()
  });

  const generateCode = () => {
    const newCode = `DISC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setCoupon({ ...coupon, code: newCode });
  };

  const saveCoupon = () => {
    // بدلاً من استخدام localStorage نقوم بإرسال القسيمة للمكوّن الأب
    onSaveCoupon(coupon);
    Swal.fire('تم!', 'تم حفظ القسيمة بنجاح', 'success');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold">مولد القسائم</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex gap-2">
          <input
            value={coupon.code}
            onChange={(e) => setCoupon({ ...coupon, code: e.target.value })}
            placeholder="أدخل الكود أو اتركه للإنشاء التلقائي"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={generateCode}
            className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            title="توليد كود جديد"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div>
          <input
            type="number"
            value={coupon.discount}
            onChange={(e) => setCoupon({ ...coupon, discount: Number(e.target.value) })}
            className="w-full p-2 border rounded"
            placeholder="نسبة الخصم %"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="number"
            value={coupon.maxUses}
            onChange={(e) => setCoupon({ ...coupon, maxUses: Number(e.target.value) })}
            className="w-full p-2 border rounded"
            placeholder="الحد الأقصى للاستخدام"
          />
        </div>
        
        <div>
          <input
            type="datetime-local"
            value={coupon.validUntil.toISOString().slice(0, 16)}
            onChange={(e) => setCoupon({ ...coupon, validUntil: new Date(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={saveCoupon}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          حفظ القسيمة
        </button>
        
        <div className="flex items-center gap-2 text-blue-600 cursor-pointer">
          <QRCodeCanvas size={20} />
          <span>عرض QR Code</span>
          <div className="hidden">
            <QRCodeCanvas value={coupon.code} size={128} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponGenerator;
