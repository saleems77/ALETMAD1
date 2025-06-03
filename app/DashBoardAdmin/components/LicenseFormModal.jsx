'use client';
import { useState } from 'react';

const licenseTypes = [
  { value: 'standard', label: 'ترخيص قياسي' },
  { value: 'premium', label: 'ترخيص متميز' },
  { value: 'educational', label: 'ترخيص تعليمي' }
];

const LicenseFormModal = ({ show, onClose, license, onSubmit }) => {
  const [formData, setFormData] = useState(license || {
    type: 'standard',
    referenceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    terms: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          {license ? 'تعديل الترخيص' : 'ترخيص جديد'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>نوع الترخيص</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              {licenseTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>الرقم المرجعي</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>تاريخ الإصدار</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={formData.issueDate}
                onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                required
              />
            </div>
            <div>
              <label>تاريخ الانتهاء</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LicenseFormModal;