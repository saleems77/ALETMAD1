'use client';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const SubscriptionSuccessModal = ({ plan, onClose }) => {
  if (!plan) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          تم الاشتراك بنجاح! 🎉
        </h2>
        <p className="text-gray-600 mb-6">
          يمكنك الآن الوصول إلى جميع ميزات اشتراك {plan.type}
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ابدأ التعلم الآن
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SubscriptionSuccessModal;