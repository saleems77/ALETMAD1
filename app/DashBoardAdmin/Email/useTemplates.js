"use client";
import { useState } from "react";

// بيانات افتراضية للقالب
const DEFAULT_TEMPLATES = [
  {
    id: 1,
    title: "رسالة ترحيب",
    content: "مرحبا {اسم العميل}، نرحب بك في منصتنا!",
  },
  {
    id: 2,
    title: "تذكير دفع",
    content: "عزيزي {الاسم}، يرجى تسديد المبلغ المستحق قبل {التاريخ}",
  },
];

export const useTemplates = () => {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);

  const saveTemplate = (newTemplate) => {
    setTemplates((prev) => [
      ...prev,
      {
        ...newTemplate,
        id: Date.now(), // إنشاء معرف فريد
      },
    ]);
  };

  return {
    templates,
    saveTemplate,
    defaultTemplates: DEFAULT_TEMPLATES,
  };
};
