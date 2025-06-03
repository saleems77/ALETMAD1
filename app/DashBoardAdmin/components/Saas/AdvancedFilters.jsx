// AdvancedFilters.jsx
'use client';
import { Input, Select, SelectItem, DatePicker } from '@nextui-org/react';

export default function AdvancedFilters() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input label="بحث بالاسم" />
      <Select label="حالة الحساب">
        <SelectItem value="active">نشطة</SelectItem>
        <SelectItem value="suspended">معلقة</SelectItem>
      </Select>
      <DatePicker label="تاريخ الإنشاء" />
    </div>
  );
}