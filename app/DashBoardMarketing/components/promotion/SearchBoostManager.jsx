'use client';
import { useState } from 'react';
import { Switch } from '@headlessui/react';

const SearchBoostManager = () => {
  // بيانات وهمية لمجموعة العروض الترويجية (promotions)
  const [promotions, setPromotions] = useState([
    { trainerId: 'trainer1', isActive: true },
    { trainerId: 'trainer2', isActive: false },
    { trainerId: 'trainer3', isActive: true }
  ]);

  const togglePromotion = (trainerId, isActive) => {
    const updated = promotions.map(p => 
      p.trainerId === trainerId ? { ...p, isActive } : p
    );
    setPromotions(updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">إدارة الظهور المميز</h2>
      
      <div className="space-y-3">
        {promotions.map(promo => (
          <div key={promo.trainerId} className="flex items-center justify-between p-3 border rounded-lg">
            <span>المدرب #{promo.trainerId}</span>
            <Switch
              checked={promo.isActive}
              onChange={(checked) => togglePromotion(promo.trainerId, checked)}
              className={`${
                promo.isActive ? 'bg-green-500' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span className="sr-only">تفعيل الظهور</span>
              <span
                className={`${
                  promo.isActive ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBoostManager;
