'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { CreditCard, Wallet } from 'lucide-react';

const PaymentGatewayModal = ({ amount, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // محاكاة عملية الدفع (لأغراض العرض فقط، بدون استخدام Stripe)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // محاكاة حفظ عملية الدفع في الذاكرة (يتم تسجيل البيانات في الـ console)
      const transaction = {
        id: Date.now(),
        amount,
        method: paymentMethod,
        status: 'completed',
        date: new Date().toISOString(),
      };
      console.log('Transaction saved:', transaction);

      await Swal.fire({
        icon: 'success',
        title: 'تم الدفع بنجاح!',
        text: `تم خصم ${amount} ر.س بنجاح`,
      });

      onClose();
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'فشل الدفع',
        text: err.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold">إتمام الدفع</h3>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('credit-card')}
                className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                  paymentMethod === 'credit-card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <CreditCard className="w-6 h-6 mb-2" />
                <span>بطاقة ائتمان</span>
              </button>

              <button
                onClick={() => setPaymentMethod('apple-pay')}
                className={`p-4 rounded-lg border-2 flex flex-col items-center ${
                  paymentMethod === 'apple-pay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <Wallet className="w-6 h-6 mb-2" />
                <span>Apple Pay</span>
              </button>
            </div>

            {paymentMethod === 'credit-card' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="رقم البطاقة"
                  className="w-full p-3 border rounded-lg"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="p-3 border rounded-lg"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="p-3 border rounded-lg"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isProcessing ? 'جاري المعالجة...' : `دفع ${amount} ر.س`}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentGatewayModal;
