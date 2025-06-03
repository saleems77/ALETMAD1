'use client';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { loadStripe } from '@stripe/stripe-js';

// يجب التأكد من توافر المفتاح في ملف .env.local مع المتغير NEXT_PUBLIC_STRIPE_KEY
const PromotionPaymentModal = ({ trainerId, onClose }) => {
  const [duration, setDuration] = useState(7); // عدد الأيام
  const [startDate, setStartDate] = useState(new Date());
  const [stripePromise, setStripePromise] = useState(null);
  const pricePerDay = 50; // السعر لكل يوم

  useEffect(() => {
    // يتم تحميل Stripe فقط على الواجهة الأمامية
    if (typeof window !== 'undefined') {
      const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
      if (stripeKey) {
        setStripePromise(loadStripe(stripeKey));
      } else {
        console.error("Stripe key غير معرف في المتغيرات البيئية");
      }
    }
  }, []);

  const handlePayment = async () => {
    if (!stripePromise) {
      console.error("Stripe غير مُهيأ");
      alert("حدث خطأ: لم يتم إعداد Stripe بشكل صحيح.");
      return;
    }

    const stripe = await stripePromise;
    if (!stripe) {
      console.error("فشل تحميل Stripe");
      return;
    }

    // إعادة التوجيه لصفحة الدفع باستخدام Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: 'price_123', quantity: duration }],
      mode: 'payment',
      successUrl: `${window.location.origin}/success?trainer=${trainerId}`,
      cancelUrl: `${window.location.origin}/cancel`
    });

    if (!error) {
      // في مثالنا هنا، نقوم بطباعة المعلومات على الـ console بدلاً من تخزينها
      console.log("تم الدفع بنجاح. من المفترض هنا حفظ بيانات الترقية.");
    } else {
      console.error("حدث خطأ أثناء عملية الدفع:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">ترقية الحساب</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1">المدة (أيام)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">تاريخ البدء</label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="text-lg font-bold">
            الإجمالي: {duration * pricePerDay} ر.س
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded hover:bg-gray-100"
            >
              إلغاء
            </button>
            <button
              onClick={handlePayment}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              تأكيد الدفع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionPaymentModal;
