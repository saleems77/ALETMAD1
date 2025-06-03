'use client';
import { useState } from 'react';

export default function CenterForm({ center, onSave, onCancel }) {
  const [formData, setFormData] = useState(center || {
    name: '',
    location: '',
    capacity: '',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        {center ? 'تعديل المركز' : 'إضافة مركز جديد'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>اسم المركز</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label>الموقع</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>

        <div>
          <label>السعة الاستيعابية</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={formData.capacity}
            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
          />
        </div>

        <div>
          <label>الحالة</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>

        <div className="flex gap-4 justify-end mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            حفظ
          </button>
        </div>
      </form>
    </div>
  );
}