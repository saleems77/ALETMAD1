'use client';
import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

// بيانات وهمية لطرق الدفع
const dummyMethods = [
  { id: 1, name: 'بطاقة ائتمان' },
  { id: 2, name: 'Apple Pay' },
];

const PaymentMethodsList = () => {
  const [methods, setMethods] = useState(dummyMethods);
  const [newMethod, setNewMethod] = useState('');

  const handleAdd = () => {
    if (newMethod.trim()) {
      const newEntry = { id: Date.now(), name: newMethod };
      setMethods((prev) => [...prev, newEntry]);
      setNewMethod('');
    }
  };

  const handleDelete = (id) => {
    setMethods((prev) => prev.filter((method) => method.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="إضافة طريقة دفع جديدة"
          className="flex-1 p-2 border rounded-lg"
          value={newMethod}
          onChange={(e) => setNewMethod(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span>{method.name}</span>
            <button
              onClick={() => handleDelete(method.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodsList;
