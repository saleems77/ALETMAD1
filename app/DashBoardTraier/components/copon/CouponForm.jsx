"use client";
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CouponForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    code: uuidv4().slice(0, 8).toUpperCase(),
    discountType: 'percentage',
    value: 10,
    maxUses: 100,
    expiryDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ ...formData, code: uuidv4().slice(0, 8).toUpperCase() });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">إنشاء كوبون جديد [[5]]</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" 
          value={formData.code} 
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          placeholder="كود الكوبون"
          className="p-3 border rounded-lg"
        />
        <select 
          value={formData.discountType}
          onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
          className="p-3 border rounded-lg"
        >
          <option value="percentage">نسبة مئوية</option>
          <option value="fixed">مبلغ ثابت</option>
        </select>
        <input 
          type="number" 
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: +e.target.value })}
          placeholder="القيمة"
          className="p-3 border rounded-lg"
        />
        <input 
          type="date" 
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          className="p-3 border rounded-lg"
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          حفظ الكوبون
        </button>
      </div>
    </form>
  );
};

export default CouponForm;