'use client';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const MaterialCard = ({ material, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
      <img 
        src={material.image} 
        alt={material.title}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{material.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{material.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            {material.price} ر.س
          </span>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, e.target.value))}
              className="w-16 px-2 py-1 border rounded"
            />
            <button
              onClick={() => onAddToCart(material, quantity)}
              className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-1"
            >
              <ShoppingCart size={16} />
              إضافة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MaterialCard;