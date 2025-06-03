'use client';
import { useState, useCallback, useEffect } from "react";
import { Draggable } from '@hello-pangea/dnd';
import PermissionsEditor from './PermissionsEditor';
import RoleSelector from './RoleSelector';
import Link from 'next/link';
import toast from 'react-hot-toast';

import {
  PencilSquareIcon,
  TrashIcon,
  DocumentChartBarIcon,
  CheckIcon,
  XMarkIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/solid';

const theme = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

export default function TeamMemberCard({ 
  member, 
  index,
  onUpdate, 
  onDelete, 
  onViewDetails 
}) {
  const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editData, setEditData] = useState({
    name: member?.username || '',
    role: member?.role?.name || ''
  });
  const [permissions, setPermissions] = useState(() => {
    // تحويل الصلاحيات من كائن إلى مصفوفة عند التهيئة
    if (typeof member?.permissions === 'object' && !Array.isArray(member.permissions)) {
      return Object.entries(member.permissions)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // تحديث الحالة عند تغيير member
  useEffect(() => {
    if (!member) return;

    if (typeof member.permissions === 'object' && !Array.isArray(member.permissions)) {
      const arrayPermissions = Object.entries(member.permissions)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);
      
      setPermissions(arrayPermissions);
    } else if (Array.isArray(member.permissions)) {
      setPermissions(member.permissions);
    } else {
      setPermissions([]);
    }
  }, [member]);
const handleDeleteConfirmSuccess = async () => {
    try {
      await onDelete();
      toast.success('تم حذف المستخدم بنجاح!', {
        style: {
          background: '#48BB78',
          color: '#fff'
        }
      });
    } catch (err) {
      toast.error('فشل في حذف المستخدم', {
        style: {
          background: '#E53E3E',
          color: '#fff'
        }
      });
    } finally {
      setShowDeleteConfirm(false);
    }
  };
  // دالة تحويل الصلاحيات من مصفوفة إلى كائن
  const formatPermissions = (permissionsArray) => {
    return permissionsArray.reduce((acc, perm) => {
      acc[perm] = true;
      return acc;
    }, {});
  };

  // حفظ التعديلات
  const handleSave = useCallback(async () => {
    if (!member?.id) return;
    
    setLoading(true);
    try {
      await onUpdate(member.id, {
        username: editData.name,
        role: editData.role,
        permissions: formatPermissions(permissions) // استخدام الدالة المعرفة
      });
      
      setIsEditing(false);
    } catch (err) {
      setError('فشل حفظ التعديلات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [editData, permissions, member?.id, onUpdate]);

  // تبديل الصلاحيات
  const handlePermissionChange = useCallback((perm, checked) => {
    if (!member?.id || !onUpdate) return;

    const newPermissions = checked 
      ? [...permissions, perm] 
      : permissions.filter(p => p !== perm);
    
    // تحديث الحالة المحلية
    setPermissions(newPermissions);
    
    // إرسال الصلاحيات المحولة إلى الـ Redux
    onUpdate(member.id, {
      permissions: formatPermissions(newPermissions) // استخدام الدالة المعرفة
    });
  }, [member?.id, permissions, onUpdate]);

  return (
    <Draggable 
      draggableId={String(member?.id || 'unknown')} 
      index={index}
    >
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef} 
          {...provided.draggableProps}
          className={`mb-3 transition-all ${snapshot.isDragging ? 'shadow-xl' : 'shadow-md'}`}
        >
          {/* تصميم البطاقة */}
          <div 
            className="p-4 rounded-lg border transition-all"
            style={{
              backgroundColor: theme.white,
              borderColor: theme.gray + '30',
              transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
              boxShadow: snapshot.isDragging 
                ? `0 4px 20px ${theme.blue}20` 
                : `0 2px 8px ${theme.gray}15`
            }}
          >
            {/* قسم الرؤوس */}
            <div className="flex items-start gap-3">
              {/* مقبض السحب */}
              <div 
                {...provided.dragHandleProps}
                className="p-1.5 rounded-md hover:bg-gray-50 cursor-grab active:cursor-grabbing"
                style={{ color: theme.gray }}
              >
                <ArrowsUpDownIcon className="w-5 h-5" />
              </div>

              {/* معلومات العضو */}
              <div className="flex-1">
                {isEditing ? (
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="text-lg font-semibold p-1 border-b w-full focus:outline-none"
                    style={{
                      color: theme.black,
                      borderColor: theme.blue
                    }}
                  />
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: theme.black }}>
                      {member?.username || 'عضو غير معروف'}
                    </h3>
                    <p style={{ color: theme.gray }}>
                      {member?.email || 'لا يوجد بريد'}
                    </p>
                    <p style={{ color: theme.gray }}>
                      {member?.role?.name ? `دور: ${member.role.name}` : 'لا يوجد دور'}
                    </p>
                  </div>
                )}
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex items-center gap-2">
                <RoleSelector
                  value={isEditing ? editData.role : member?.role?.name || 'employee'}
                  onChange={(role) => setEditData(prev => ({ ...prev, role }))}
                  disabled={!isEditing}
                />

                <button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: isEditing ? theme.blue + '20' : 'transparent',
                    color: isEditing ? theme.blue : theme.gray
                  }}
                  aria-label={isEditing ? 'حفظ التعديلات' : 'تعديل'}
                >
                  {isEditing ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <PencilSquareIcon className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={onViewDetails}
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{
                    color: theme.blue,
                    backgroundColor: theme.blue + '10'
                  }}
                  aria-label="عرض التفاصيل"
                >
                  <Link href={`/user/${member?.id}`}>
                    <DocumentChartBarIcon className="w-5 h-5" />
                  </Link>
                </button>

                <button
                  onClick={onDelete}
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{
                    color: theme.red,
                    backgroundColor: theme.red + '10'
                  }}
                  aria-label="حذف العضو"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* قسم الصلاحيات */}
            <div className="mt-4 pl-9">
              <PermissionsEditor
                permissions={permissions}
                onChange={handlePermissionChange}
              />
            </div>

            {/* رسائل الخطأ والتحميل */}
            {isEditing && (
              <div 
                className="mt-4 p-2 rounded-md flex items-center gap-2 text-sm"
                style={{
                  backgroundColor: theme.yellow + '15',
                  color: theme.yellow
                }}
              >
                <XMarkIcon className="w-4 h-4" />
                <span>وضع التعديل نشط - التغييرات غير محفوظة بعد</span>
              </div>
            )}

            {error && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {loading && (
              <div className="mt-2 p-2 bg-yellow-100 text-yellow-700 rounded">
                جاري الحفظ...
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}