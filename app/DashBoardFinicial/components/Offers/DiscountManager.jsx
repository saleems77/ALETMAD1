'use client';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Percent } from 'lucide-react';
import Swal from 'sweetalert2';

const DiscountManager = () => {
  const [discount, setDiscount] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    startDate: new Date(),
    endDate: new Date(),
    applicableCourses: []
  });

  const generateCode = () => {
    const code = `DISC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setDiscount({ ...discount, code });
  };

  const validateDiscount = () => {
    if (discount.value <= 0) throw new Error('قيمة التخفيض غير صالحة');
    if (discount.endDate <= discount.startDate) throw new Error('التاريخ غير صحيح');
  };

  // حفظ العرض باستخدام بيانات وهمية
  const saveDiscount = () => {
    try {
      validateDiscount();
      console.log('Saved discount:', discount);
      Swal.fire('تم الحفظ!', 'العرض تم تخزينه بنجاح', 'success');
    } catch (err) {
      Swal.fire('خطأ!', err.message, 'error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Percent className="w-5 h-5" />
        إنشاء عرض جديد
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>كود التخفيض</label>
          <div className="flex gap-2">
            <input
              value={discount.code}
              onChange={(e) => setDiscount({ ...discount, code: e.target.value })}
              className="flex-1 p-2 border rounded"
              placeholder="GEN-CODE"
            />
            <button
              onClick={generateCode}
              className="px-3 bg-gray-100 rounded hover:bg-gray-200"
            >
              توليد
            </button>
          </div>
        </div>

        <div>
          <label>نوع التخفيض</label>
          <select
            value={discount.type}
            onChange={(e) => setDiscount({ ...discount, type: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="percentage">نسبة مئوية</option>
            <option value="fixed">مبلغ ثابت</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>قيمة التخفيض</label>
          <input
            type="number"
            value={discount.value}
            onChange={(e) => setDiscount({ ...discount, value: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>الفترة الزمنية</label>
          <div className="flex gap-2">
            <DatePicker
              selected={discount.startDate}
              onChange={(date) => setDiscount({ ...discount, startDate: date })}
              className="w-full p-2 border rounded"
              placeholderText="تاريخ البداية"
            />
            <DatePicker
              selected={discount.endDate}
              onChange={(date) => setDiscount({ ...discount, endDate: date })}
              className="w-full p-2 border rounded"
              placeholderText="تاريخ النهاية"
              minDate={discount.startDate}
            />
          </div>
        </div>
      </div>

      <button
        onClick={saveDiscount}
        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        حفظ العرض
      </button>
    </div>
  );
};

export default DiscountManager;
