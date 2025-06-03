'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const UserSubscriptionStatus = () => {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const savedSub = JSON.parse(localStorage.getItem('subscription'));
    setSubscription(savedSub);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
      <div className="flex items-center gap-4">
        {subscription ? (
          <>
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                اشتراك {subscription.type} نشط
              </h3>
              <p className="text-gray-600">
                تاريخ التجديد: ١ يناير ٢٠٢٥
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                لا يوجد اشتراك نشط
              </h3>
              <p className="text-gray-600">
                اختر خطة لتبدأ رحلة التعلم
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserSubscriptionStatus;