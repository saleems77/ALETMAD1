'use client';
import { useState } from 'react';
import { CheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const AddUserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'assistant',
    permissions: []
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ username: '', email: '', password: '', role: 'assistant', permissions: [] });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* اسم المستخدم */}
        <div>
          <label className="block text-sm mb-1">اسم المستخدم</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label className="block text-sm mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            required
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* كلمة المرور مع زر العرض */}
        <div>
          <label className="block text-sm mb-1">كلمة المرور</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full p-2 border rounded pr-10"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* اختيار الدور */}
        <div>
          <label className="block text-sm mb-1">الدور</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="support">دعم</option>
            <option value="assistant">مساعد</option>
            <option value="Admin">مدير</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
      >
        <CheckIcon className="w-5 h-5" />
        إضافة مستخدم
      </button>
    </form>
  );
};

export default AddUserForm;