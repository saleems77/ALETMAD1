"use client"
import React, { useState } from 'react';
import UserFormModal from './UserFormModal';
import RoleBadge from './RoleBadge';

const userRoles = {
  admin: 'مدير النظام',
  trainer: 'مدرب',
  trainee: 'متدرب',
  staff: 'موظف',
  agent: 'وكيل'
};

const userCategories = [
  { value: 'all', label: 'جميع الفئات' },
  { value: 'admin', label: 'المدراء' },
  { value: 'trainer', label: 'المدربين' },
  { value: 'trainee', label: 'المتدربين' },
  { value: 'staff', label: 'الموظفين' },
  { value: 'agent', label: 'الوكلاء' }
];

const UsersTable = ({ users, onUpdate, onDelete }) => {
  const [selectedRole, setSelectedRole] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter(user => 
    selectedRole === 'all' ? true : user.role === selectedRole
  );

  const handleSuspend = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: 'موقوف' } : user
    );
    onUpdate(updatedUsers);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold">إدارة المستخدمين</h3>
        <div className="flex items-center space-x-4">
          <select
            className="p-2 border rounded"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {userCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              setSelectedUser(null);
              setShowForm(true);
            }}
          >
            إضافة مستخدم
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right">الاسم</th>
              <th className="px-6 py-3 text-right">البريد الإلكتروني</th>
              <th className="px-6 py-3 text-right">الدور</th>
              <th className="px-6 py-3 text-right">الحالة</th>
              <th className="px-6 py-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    user.status === 'نشط' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowForm(true);
                    }}
                  >
                    تعديل
                  </button>
                  <button
                    className="text-yellow-600 hover:text-yellow-800"
                    onClick={() => handleSuspend(user.id)}
                  >
                    تعليق
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      if(window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
                        onDelete(user.id);
                      }
                    }}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserFormModal
        show={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        roles={userRoles}
        onSubmit={(userData) => {
          if (userData.id) {
            const updated = users.map(u => u.id === userData.id ? userData : u);
            onUpdate(updated);
          } else {
            onUpdate([...users, { ...userData, id: Date.now() }]);
          }
        }}
      />
    </div>
  );
};

export default UsersTable;