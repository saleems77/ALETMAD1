'use client';
import { useEffect, useState } from 'react';
import { Clock, Zap, Flame } from 'lucide-react';

const OfferBadge = ({ 
  discount,
  type = 'percentage',
  position = 'top-right',
  size = 'medium',
  expiresAt,
  variant = 'hot'
}) => {
  const [timeLeft, setTimeLeft] = useState('');

  // حساب الوقت المتبقي للعرض
  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(expiresAt);
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  // تحديد الألوان حسب النوع
  const variantStyles = {
    hot: 'bg-red-500 text-white',
    new: 'bg-blue-500 text-white',
    exclusive: 'bg-purple-500 text-white',
    ending: 'bg-orange-500 text-white'
  };

  // تحديد الحجم
  const sizeStyles = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2'
  };

  // تحديد الموضع
  const positionStyles = {
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2'
  };

  // اختيار الأيقونة بناءً على النوع
  const getIcon = () => {
    switch(variant) {
      case 'hot': return <Flame className="w-4 h-4 mr-1" />;
      case 'ending': return <Clock className="w-4 h-4 mr-1" />;
      default: return <Zap className="w-4 h-4 mr-1" />;
    }
  };

  // تنسيق قيمة الخصم
  const formatDiscount = () => {
    if (type === 'percentage') return `${discount}%`;
    if (type === 'fixed') return `${discount} ر.س`;
    return discount;
  };

  return (
    <div className={`absolute ${positionStyles[position]} flex items-center rounded-full shadow-lg ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {getIcon()}
      <span className="font-medium">
        {formatDiscount()}
        {timeLeft && (
          <span className="ml-1 text-xs">
            | {timeLeft}
          </span>
        )}
      </span>
    </div>
  );
};

export default OfferBadge;
