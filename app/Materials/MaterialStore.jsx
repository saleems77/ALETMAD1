'use client';
import { useEffect, useState } from 'react';
import MaterialCard from './MaterialCard';
import CartSidebar from './CartSidebar';
import { ShoppingCart } from 'lucide-react'; // تأكد من استيراد الأيقونة


const mockMaterials = [
  {
    id: 1,
    title: 'كتاب البرمجة المتقدمة',
    description: 'أفضل مرجع لتعلم الخوارزميات وهياكل البيانات',
    price: 120,
    image: '/books/programming.jpg',
    stock: 15
  },
  // ... مواد أخرى
];

export default function MaterialStore() {
  const [materials, setMaterials] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const savedMaterials = JSON.parse(localStorage.getItem('materials') || '[]');
    setMaterials(savedMaterials.length ? savedMaterials : mockMaterials);
  }, []);

  const addToCart = (material, quantity) => {
    const existing = cart.find(item => item.id === material.id);
    const updatedCart = existing
      ? cart.map(item => 
          item.id === material.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        )
      : [...cart, { ...material, quantity }];
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">متجر المواد التعليمية</h1>
        <button
          onClick={() => setShowCart(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <ShoppingCart size={20} />
          سلة المشتريات ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map(material => (
          <MaterialCard
            key={material.id}
            material={material}
            onAddToCart={addToCart}
          />
        ))}
      </div>

      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        setCart={setCart}
      />
    </div>
  );
}