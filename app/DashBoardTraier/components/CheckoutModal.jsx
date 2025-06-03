'use client';
import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, cart }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // محاكاة عملية دفع
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // مسح السلة بعد اكتمال الدفع
      localStorage.removeItem('cart');
      setTimeout(onClose, 2000);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        {isSuccess ? (
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">تمت العملية بنجاح!</h3>
            <p className="text-gray-600">سيتم إرسال الفاتورة إلى بريدك الإلكتروني</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold mb-4">تفاصيل الدفع</h3>

            <div>
              <label>الاسم الكامل</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label>العنوان</label>
              <textarea
                className="w-full p-2 border rounded"
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>رقم البطاقة</label>
                <input
                  type="text"
                  pattern="\d{16}"
                  className="w-full p-2 border rounded"
                  placeholder="1234 5678 9012 3456"
                  required
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                />
              </div>

              <div>
                <label>تاريخ الانتهاء</label>
                <input
                  type="text"
                  pattern="\d{2}/\d{2}"
                  placeholder="MM/YY"
                  className="w-full p-2 border rounded"
                  required
                  value={formData.expiry}
                  onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                />
              </div>

              <div>
                <label>CVV</label>
                <input
                  type="text"
                  pattern="\d{3}"
                  className="w-full p-2 border rounded"
                  placeholder="123"
                  required
                  value={formData.cvv}
                  onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    جاري المعالجة...
                  </div>
                ) : 'تأكيد الدفع'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;