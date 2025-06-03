'use client';
import { createContext, useContext, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

// إنشاء السياق
const ConfirmContext = createContext(null);

// مقدم السياق
export const ConfirmProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'تأكيد',
    cancelText: 'إلغاء',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const confirm = (options) => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        title: options.title || 'تأكيد الإجراء',
        message: options.message || 'هل أنت متأكد من رغبتك في تنفيذ هذا الإجراء؟',
        confirmText: options.confirmText || 'نعم',
        cancelText: options.cancelText || 'لا',
        onConfirm: () => {
          resolve(true);
          setDialogState(prev => ({ ...prev, isOpen: false }));
        },
        onCancel: () => {
          resolve(false);
          setDialogState(prev => ({ ...prev, isOpen: false }));
        }
      });
    });
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog {...dialogState} />
    </ConfirmContext.Provider>
  );
};

// خطاف الاستخدام
export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('يجب استخدام useConfirm داخل ConfirmProvider');
  }
  return context;
};