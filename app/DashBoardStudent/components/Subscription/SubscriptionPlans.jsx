'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import SubscriptionSuccessModal from './SubscriptionSuccessModal';

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      type: 'شهري',
      price: '49',
      features: ['جميع الدورات', 'دعم فوري', 'تحديثات شهرية'],
      popular: true
    },
    {
      type: 'سنوي',
      price: '490',
      features: ['وفر 20%', 'دورات حصرية', 'شهادة مجانية']
    }
  ];

  const handleSubscribe = async (plan) => {
    setIsLoading(true);
    // محاكاة عملية دفع تستغرق 1.5 ثانية
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSelectedPlan(plan);
    setIsLoading(false);
    localStorage.setItem('subscription', JSON.stringify(plan));
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 p-6">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {plan.popular && (
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm rounded-bl-lg">
              الأكثر شيوعًا
            </div>
          )}
          
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              اشتراك {plan.type}
            </h3>
            
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-gray-500"> ر.س / {plan.type === 'شهري' ? 'شهر' : 'سنة'}</span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan)}
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                isLoading 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? 'جاري المعالجة...' : 'ابدأ الآن'}
            </button>
          </div>
        </motion.div>
      ))}

      <SubscriptionSuccessModal 
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </div>
  );
};

export default SubscriptionPlans;