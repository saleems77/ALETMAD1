// PermissionsEditor.tsx
"use client";
import React, { useState, useEffect } from 'react';

export default function PermissionsEditor({ 
 initialPermissions = [],  onChange 
}) {
  const [permissions, setPermissions] = useState(initialPermissions);
  
  // قائمة الصلاحيات المتاحة
  const allPermissions = ['create_user', 'edit_user', 'delete_user', 'view_dashboard'];

  // معالجة تغيير حالة الصلاحية
   useEffect(() => {
    if (!initialPermissions) return;
    
    if (Array.isArray(initialPermissions)) {
      // إذا كانت المصفوفة تحتوي على صلاحيات مباشرة
      setPermissions([...initialPermissions]);
    } else if (typeof initialPermissions === 'object' && initialPermissions !== null) {
      // إذا كانت الصلاحيات ككائن { create_user: true }
      const arrayPermissions = Object.entries(initialPermissions)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);
      
      setPermissions(arrayPermissions);
    }
  }, []);

  const handleToggle = (perm) => {
  const newPermissions = permissions.includes(perm)
    ? permissions.filter(p => p !== perm)
    : [...permissions, perm];
  
  if (onChange && JSON.stringify(newPermissions) !== JSON.stringify(permissions)) {
    setPermissions(newPermissions);
    onChange(newPermissions);
  }
};

  return (
    <div className="space-y-2">
      <h4 className="font-medium">الصلاحيات:</h4>
      <div className="grid grid-cols-2 gap-2">
        {allPermissions.map(perm => (
          <label key={perm} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={permissions.includes(perm)}
              onChange={() => handleToggle(perm)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{perm}</span>
          </label>
        ))}
      </div>
    </div>
  );
}