import { Input, Select, Button ,SelectItem } from "@nextui-org/react";
import { useState } from "react";
export default function InstitutionForm({ institution, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    subscriptionTier: 'basic',
    modules: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ ...formData, id: institution?.id });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="اسم المركز"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Select
        label="الباقة"
        value={formData.subscriptionTier}
        onChange={(e) => setFormData({ ...formData, subscriptionTier: e.target.value })}
      >
        <SelectItem value="basic">الأساسية</SelectItem>
        <SelectItem value="pro">المتقدمة</SelectItem>
        <SelectItem value="enterprise">الشركات</SelectItem>
      </Select>
      <Button type="submit" color="primary">
        {institution ? 'تحديث' : 'إنشاء'}
      </Button>
    </form>
  );
}