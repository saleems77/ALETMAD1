'use client';
import { X } from 'lucide-react';
import CheckoutModal from './CheckoutModal';
import { useState } from 'react';
export default function CartSidebar({ isOpen, onClose, cart, setCart }) {
  const [showCheckout, setShowCheckout] = useState(false);
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">سلة المشتريات</h2>
          <button onClick={onClose} className="text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-4">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <span>{item.quantity} × {item.price} ر.س</span>
                  <button 
                    onClick={() => setCart(cart.filter(i => i.id !== item.id))}
                    className="text-red-500 text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>الإجمالي:</span>
            <span>{total} ر.س</span>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-green-600 text-white py-3 rounded-lg"
          >
            اتمام الشراء
          </button>
        </div>

        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          cart={cart}
        />
      </div>
    </div>
  );
}