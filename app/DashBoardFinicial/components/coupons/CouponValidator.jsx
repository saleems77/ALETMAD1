'use client';
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const CouponValidator = ({ coupons }) => {
  const [code, setCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  const validateCoupon = () => {
    const found = coupons.find(c => c.code === code);
    
    if (found) {
      setValidationResult({
        valid: true,
        message: `خصم ${found.discount}% متاح!`
      });
    } else {
      setValidationResult({
        valid: false,
        message: 'قسيمة غير صالحة'
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 mt-6">
      <h2 className="text-xl font-bold">التحقق من القسيمة</h2>
      
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="أدخل كود القسيمة"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={validateCoupon}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          تحقق
        </button>
      </div>

      {validationResult && (
        <div className={`p-3 rounded flex items-center gap-2 ${
          validationResult.valid ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {validationResult.valid ? (
            <CheckCircle className="text-green-600" />
          ) : (
            <XCircle className="text-red-600" />
          )}
          <span>{validationResult.message}</span>
        </div>
      )}
    </div>
  );
};

export default CouponValidator;
