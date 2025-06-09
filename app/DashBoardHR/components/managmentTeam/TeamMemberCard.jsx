// TeamMemberCard.jsx
'use client';
import { useState, useCallback, useEffect } from "react";
import { Draggable } from '@hello-pangea/dnd';
import PermissionsEditor from './PermissionsEditor';
import RoleSelector from './RoleSelector';
import toast from 'react-hot-toast';
import {
  PencilSquareIcon,
  TrashIcon,
  DocumentChartBarIcon,
  CheckIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const theme = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

// قاموس لترجمة مفاتيح الصلاحيات إلى أسماء عربية
const PERMISSION_TRANSLATIONS = {
  'create_user': 'إنشاء مستخدمين',
  'edit_user': 'تعديل المستخدمين',
  'delete_user': 'حذف المستخدمين',
  'view_users': 'عرض المستخدمين',
  'create_course': 'إنشاء دورات',
  'edit_course': 'تعديل الدورات',
  'delete_course': 'حذف الدورات',
  'publish_course': 'نشر الدورات',
  'enroll_students': 'تسجيل الطلاب',
  'manage_grades': 'إدارة الدرجات',
  'view_progress': 'متابعة التقدم',
  'view_payments': 'عرض المدفوعات',
  'manage_invoices': 'إدارة الفواتير',
  'financial_reports': 'التقارير المالية',
  'create_campaigns': 'إنشاء حملات',
  'manage_promotions': 'إدارة العروض',
  'analytics_view': 'تحليل الأداء',
  'manage_employees': 'إدارة الموظفين',
  'manage_attendance': 'إدارة الحضور',
  'payroll_management': 'إدارة الرواتب',
  'system_settings': 'إعدادات النظام',
  'manage_roles': 'إدارة الأدوار',
  'backup_restore': 'النسخ الاحتياطي'
};

export default function TeamMemberCard({ 
  member, 
  index,
  dragHandleProps,
  onUpdate, 
  onDelete, 
  onViewDetails 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  const [editData, setEditData] = useState({
    name: member?.username || '',
    role: member?.role?.name || ''
  });
  
  // حالة مؤقتة للصلاحيات أثناء التحرير
  const [tempPermissions, setTempPermissions] = useState(() => {
    return getPermissionsArray(member);
  });
  
  // الصلاحيات الحالية (غير التحرير)
  const [permissions, setPermissions] = useState(() => {
    return getPermissionsArray(member);
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // دالة مساعدة للحصول على مصفوفة الصلاحيات
  function getPermissionsArray(member) {
    if (!member) return [];
    
    if (typeof member.permissions === 'object' && !Array.isArray(member.permissions)) {
      return Object.entries(member.permissions)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);
    }
    
    return member?.permissions || [];
  }

  // تحديث الحالة عند تغيير member
  useEffect(() => {
    const newPermissions = getPermissionsArray(member);
    setPermissions(newPermissions);
    setTempPermissions(newPermissions);
    
    setEditData({
      name: member.username || '',
      role: member.role?.name || ''
    });
  }, [member]);

  const handleDeleteConfirmSuccess = async () => {
    try {
      await onDelete();
      toast.success('تم حذف المستخدم بنجاح!');
    } catch (err) {
      toast.error('فشل في حذف المستخدم');
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
    setError(null); // إعادة تعيين حالة الخطأ
    
    try {
      // إنشاء كائن التحديثات مع تضمين معرف الدور
      const updates = {
        username: editData.name,
        role: editData.role,
        permissions: formatPermissions(tempPermissions)
      };
      
      // إرسال التحديثات
      const response = await onUpdate(member.id, updates);
      
      // تحديث الحالة المحلية بعد الحفظ
      setPermissions(tempPermissions);
      setIsEditing(false);
      
      toast.success('تم تحديث بيانات المستخدم بنجاح');
    } catch (err) {
      setError('فشل حفظ التعديلات: ' + err.message);
      console.error('فشل في تحديث المستخدم:', err);
      toast.error('فشل في تحديث بيانات المستخدم: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [editData, tempPermissions, member?.id, onUpdate]);

  // عند التغيير في محرر الصلاحيات، نحدث الحالة المؤقتة فقط
  const handlePermissionChange = useCallback((newPermissions) => {
    setTempPermissions(newPermissions);
  }, []);

  // ترجمة مفتاح الصلاحية إلى اسم عربي
  const translatePermission = (key) => {
    return PERMISSION_TRANSLATIONS[key] || key;
  };

  // عرض آخر تاريخ دخول
  const formatLastLogin = () => {
    if (!member.lastLogin) return 'لم يسجل دخول بعد';
    
    const loginDate = new Date(member.lastLogin);
    return loginDate.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mb-3 transition-all">
      {/* تصميم البطاقة */}
      <div 
        className="rounded-lg border transition-all overflow-hidden"
        style={{
          backgroundColor: theme.white,
          borderColor: theme.gray + '30',
          boxShadow: `0 2px 8px ${theme.gray}10`
        }}
      >
        {/* قسم الرؤوس */}
        <div className="flex items-start gap-3 p-4">
          {/* مقبض السحب */}
          <div 
            {...dragHandleProps}
            className="p-1.5 rounded-md hover:bg-gray-50 cursor-grab active:cursor-grabbing flex-shrink-0"
            style={{ color: theme.gray }}
          >
            <ArrowsUpDownIcon className="w-5 h-5" />
          </div>

          {/* معلومات العضو */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              {isEditing ? (
                <div className="w-full">
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="text-lg font-semibold p-2 w-full rounded border mb-2"
                    style={{
                      color: theme.black,
                      borderColor: theme.blue
                    }}
                    placeholder="اسم المستخدم"
                  />
                  <RoleSelector
                    value={editData.role}
                    onChange={(role) => setEditData(prev => ({ ...prev, role }))}
                  />
                </div>
              ) : (
                <div className="w-full">
                  <h3 
                    className="text-lg font-semibold cursor-pointer flex items-center gap-2"
                    style={{ color: theme.black }}
                    onClick={() => setShowFullDetails(!showFullDetails)}
                  >
                    {member?.username || 'عضو غير معروف'}
                    {showFullDetails ? 
                      <ChevronUpIcon className="w-4 h-4" /> : 
                      <ChevronDownIcon className="w-4 h-4" />
                    }
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm" style={{ color: theme.gray }}>
                      {member?.email || 'لا يوجد بريد'}
                    </span>
                    <span 
                      className="px-2 py-1 text-xs rounded-full"
                      style={{ 
                        backgroundColor: theme.blue + '20',
                        color: theme.blue
                      }}
                    >
                      {member?.role?.name || 'بدون دور'}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity flex-shrink-0"
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
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity flex-shrink-0"
                  style={{
                    color: theme.blue,
                    backgroundColor: theme.blue + '10'
                  }}
                  aria-label="عرض التفاصيل"
                >
                  <DocumentChartBarIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity flex-shrink-0"
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
            
            {/* معلومات إضافية */}
            {showFullDetails && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.gray + '20' }}>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs" style={{ color: theme.gray }}>تاريخ الإنشاء</p>
                    <p className="text-sm font-medium" style={{ color: theme.black }}>
                      {new Date(member.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: theme.gray }}>آخر دخول</p>
                    <p className="text-sm font-medium" style={{ color: theme.black }}>
                      {formatLastLogin()}
                    </p>
                  </div>
                </div>
                
                {/* عرض الصلاحيات المختارة */}
                {permissions.length > 0 && (
                  <div className="mt-3">
                    <div 
                      className="flex items-center justify-between cursor-pointer p-2 rounded"
                      style={{ backgroundColor: theme.blue + '10' }}
                      onClick={() => setShowPermissions(!showPermissions)}
                    >
                      <h4 className="text-sm font-medium" style={{ color: theme.blue }}>
                        الصلاحيات الممنوحة ({permissions.length})
                      </h4>
                      {showPermissions ? 
                        <ChevronUpIcon className="w-4 h-4" style={{ color: theme.blue }} /> : 
                        <ChevronDownIcon className="w-4 h-4" style={{ color: theme.blue }} />
                      }
                    </div>
                    
                    {showPermissions && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {permissions.map(perm => (
                          <div 
                            key={perm} 
                            className="flex items-center gap-2 p-2 rounded"
                            style={{ backgroundColor: theme.blue + '05' }}
                          >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.blue }}></div>
                            <span className="text-sm" style={{ color: theme.black }}>
                              {translatePermission(perm)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* قسم الصلاحيات (في وضع التحرير) */}
        {isEditing && (
          <div className="mt-0 border-t" style={{ borderColor: theme.gray + '20' }}>
            <div className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2" style={{ color: theme.black }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.blue }}></div>
                تعديل الصلاحيات
              </h4>
              <PermissionsEditor
                permissions={tempPermissions}
                onChange={handlePermissionChange}
                compactMode={true}
              />
            </div>
          </div>
        )}

        {/* رسائل الخطأ والتحميل */}
        {isEditing && (
          <div 
            className="p-3 flex items-center gap-2 text-sm"
            style={{
              backgroundColor: theme.yellow + '15',
              color: theme.yellow,
              borderTop: `1px solid ${theme.yellow + '30'}`
            }}
          >
            <XMarkIcon className="w-4 h-4" />
            <span>وضع التعديل نشط - التغييرات غير محفوظة بعد</span>
          </div>
        )}

        {error && (
          <div 
            className="p-3 flex items-center gap-2 text-sm"
            style={{
              backgroundColor: theme.red + '15',
              color: theme.red,
              borderTop: `1px solid ${theme.red + '30'}`
            }}
          >
            <XMarkIcon className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div 
            className="p-3 flex items-center gap-2 text-sm"
            style={{
              backgroundColor: theme.blue + '15',
              color: theme.blue,
              borderTop: `1px solid ${theme.blue + '30'}`
            }}
          >
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>جاري حفظ التغييرات...</span>
          </div>
        )}
      </div>

      {/* تأكيد الحذف */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full"
            style={{ boxShadow: `0 10px 25px ${theme.black}30` }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: theme.black }}>تأكيد الحذف</h3>
            <p className="mb-4" style={{ color: theme.gray }}>
              هل أنت متأكد من رغبتك في حذف العضو <strong style={{ color: theme.red }}>{member.username}</strong>؟ 
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg font-medium"
                style={{ 
                  backgroundColor: theme.gray + '20',
                  color: theme.gray
                }}
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteConfirmSuccess}
                className="px-4 py-2 rounded-lg font-medium"
                style={{ 
                  backgroundColor: theme.red,
                  color: theme.white
                }}
              >
                نعم، احذف العضو
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}