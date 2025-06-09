// PermissionsEditor.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

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

export default function PermissionsEditor({ 
  initialPermissions = [],  
  onChange,
  compactMode = false
}) {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // قائمة الصلاحيات الموسعة مع الأوصاف بالعربية
  const allPermissions = [
    {
      key: 'user_management',
      title: 'إدارة المستخدمين',
      icon: '👥',
      permissions: [
        { key: 'create_user', title: 'إنشاء مستخدمين', description: 'القدرة على إضافة مستخدمين جدد' },
        { key: 'edit_user', title: 'تعديل المستخدمين', description: 'تعديل بيانات المستخدمين الحاليين' },
        { key: 'delete_user', title: 'حذف المستخدمين', description: 'إزالة المستخدمين من النظام' },
        { key: 'view_users', title: 'عرض المستخدمين', description: 'تصفح قائمة جميع المستخدمين' }
      ]
    },
    {
      key: 'course_management',
      title: 'إدارة الدورات',
      icon: '📚',
      permissions: [
        { key: 'create_course', title: 'إنشاء دورات', description: 'إضافة دورات تعليمية جديدة' },
        { key: 'edit_course', title: 'تعديل الدورات', description: 'تعديل محتوى الدورات الحالية' },
        { key: 'delete_course', title: 'حذف الدورات', description: 'إزالة الدورات من النظام' },
        { key: 'publish_course', title: 'نشر الدورات', description: 'إتاحة الدورات للطلاب' }
      ]
    },
    {
      key: 'student_management',
      title: 'إدارة الطلاب',
      icon: '👨‍🎓',
      permissions: [
        { key: 'enroll_students', title: 'تسجيل الطلاب', description: 'إضافة طلاب جدد للدورات' },
        { key: 'manage_grades', title: 'إدارة الدرجات', description: 'تسجيل وتعديل درجات الطلاب' },
        { key: 'view_progress', title: 'متابعة التقدم', description: 'مراقبة تقدم الطلاب في الدورات' }
      ]
    },
    {
      key: 'financial_management',
      title: 'الإدارة المالية',
      icon: '💰',
      permissions: [
        { key: 'view_payments', title: 'عرض المدفوعات', description: 'مراجعة سجلات الدفع للطلاب' },
        { key: 'manage_invoices', title: 'إدارة الفواتير', description: 'إنشاء وتعديل الفواتير' },
        { key: 'financial_reports', title: 'التقارير المالية', description: 'إنشاء تقارير عن الإيرادات' }
      ]
    },
    {
      key: 'marketing_management',
      title: 'التسويق',
      icon: '📢',
      permissions: [
        { key: 'create_campaigns', title: 'إنشاء حملات', description: 'تصميم حملات تسويقية جديدة' },
        { key: 'manage_promotions', title: 'إدارة العروض', description: 'تخصيص العروض الترويجية' },
        { key: 'analytics_view', title: 'تحليل الأداء', description: 'مراجعة إحصائيات الحملات' }
      ]
    },
    {
      key: 'hr_management',
      title: 'الموارد البشرية',
      icon: '👔',
      permissions: [
        { key: 'manage_employees', title: 'إدارة الموظفين', description: 'تسجيل وتعديل بيانات الموظفين' },
        { key: 'manage_attendance', title: 'إدارة الحضور', description: 'تسجيل حضور وانصراف الموظفين' },
        { key: 'payroll_management', title: 'إدارة الرواتب', description: 'حساب وصرف رواتب الموظفين' }
      ]
    },
    {
      key: 'system_management',
      title: 'إدارة النظام',
      icon: '⚙️',
      permissions: [
        { key: 'system_settings', title: 'إعدادات النظام', description: 'تعديل الإعدادات العامة' },
        { key: 'manage_roles', title: 'إدارة الأدوار', description: 'إنشاء وتعديل أدوار المستخدمين' },
        { key: 'backup_restore', title: 'النسخ الاحتياطي', description: 'إدارة نسخ النظام الاحتياطية' }
      ]
    }
  ];

  useEffect(() => {
    if (!initialPermissions) return;
    
    let newPermissions = [];
    
    if (Array.isArray(initialPermissions)) {
      newPermissions = [...initialPermissions];
    } else if (typeof initialPermissions === 'object' && initialPermissions !== null) {
      newPermissions = Object.entries(initialPermissions)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);
    }
    
    if (JSON.stringify(newPermissions) !== JSON.stringify(permissions)) {
      setPermissions(newPermissions);
    }
  }, [initialPermissions, permissions]);

  const handleToggle = (perm) => {
    const newPermissions = permissions.includes(perm)
      ? permissions.filter(p => p !== perm)
      : [...permissions, perm];
    
    setPermissions(newPermissions);
    if (onChange) {
      onChange(newPermissions);
    }
  };

  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const toggleAllCategories = (expand) => {
    const newState = {};
    allPermissions.forEach(cat => {
      newState[cat.key] = expand;
    });
    setExpandedCategories(newState);
  };

  return (
    <div className="space-y-4">
      {!compactMode && (
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-lg" style={{ color: '#1f2937' }}>إدارة الصلاحيات:</h4>
          <div className="flex gap-2">
            <button 
              onClick={() => toggleAllCategories(true)}
              className="text-sm px-3 py-1 rounded"
              style={{ backgroundColor: '#f0f7ff', color: '#008DCB' }}
            >
              فتح الكل
            </button>
            <button 
              onClick={() => toggleAllCategories(false)}
              className="text-sm px-3 py-1 rounded"
              style={{ backgroundColor: '#f0f7ff', color: '#008DCB' }}
            >
              غلق الكل
            </button>
          </div>
        </div>
      )}
      
      {allPermissions.map(category => (
        <div 
          key={category.key} 
          className={`rounded-lg overflow-hidden ${
            compactMode ? 'mb-3' : 'mb-4'
          }`}
          style={{ 
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb'
          }}
        >
          <div 
            className={`flex items-center justify-between p-3 cursor-pointer ${
              expandedCategories[category.key] ? 'bg-blue-50' : ''
            }`}
            onClick={() => toggleCategory(category.key)}
            style={{ 
              backgroundColor: expandedCategories[category.key] ? '#f0f7ff' : '#f9fafb',
              borderBottom: expandedCategories[category.key] ? '1px solid #d1e9ff' : 'none'
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium" style={{ color: '#1f2937' }}>
                {category.title}
              </span>
            </div>
            {expandedCategories[category.key] ? (
              <ChevronUpIcon className="w-5 h-5" style={{ color: '#008DCB' }} />
            ) : (
              <ChevronDownIcon className="w-5 h-5" style={{ color: '#6b7280' }} />
            )}
          </div>
          
          {expandedCategories[category.key] && (
            <div className={`grid gap-2 p-3 ${
              compactMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
            }`}>
              {category.permissions.map(perm => (
                <div 
                  key={perm.key} 
                  className={`p-3 rounded-lg border transition-colors flex items-start gap-3 ${
                    permissions.includes(perm.key) 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm.key)}
                    onChange={() => handleToggle(perm.key)}
                    className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="block font-medium text-gray-800">
                        {perm.title}
                      </span>
                      {permissions.includes(perm.key) && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          مفعل
                        </span>
                      )}
                    </div>
                    {!compactMode && (
                      <p className="text-xs text-gray-500 mt-1">{perm.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}