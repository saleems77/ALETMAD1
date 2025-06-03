// components/ui/tabs.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

// 1. إنشاء كونтекست لإدارة الحالة
const TabsContext = createContext<{
  value: string;
  setValue: (value: string) => void;
}>({
  value: '',
  setValue: () => {},
});

// 2. المكون الرئيسي للتبويبات
export const Tabs = ({
  defaultValue,
  children,
}: {
  defaultValue: string;
  children: React.ReactNode;
}) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
};

// 3. مكون قائمة التبويبات
export const TabsList = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'flex h-10 items-center justify-start gap-2 border-b rtl:flex-row-reverse',
        className
      )}
    >
      {children}
    </div>
  );
};

// 4. مكون زر التبويب
export const TabsTrigger = ({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const { value: currentValue, setValue } = useContext(TabsContext);
  
  return (
    <button
      onClick={() => setValue(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-all',
        'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        currentValue === value
          ? 'border-b-2 border-primary text-primary'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      {children}
    </button>
  );
};

// 5. مكون محتوى التبويب
export const TabsContent = ({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const { value: currentValue } = useContext(TabsContext);

  return currentValue === value ? (
    <div className={cn('mt-4', className)}>{children}</div>
  ) : null;
};