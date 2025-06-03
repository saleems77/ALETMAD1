// src/data/mockCRM.js
export const mockContacts = [
  {
    id: "c1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966500000001",
    status: "active",
    lastInteraction: "2024-03-20",
    company: "شركة التقنية المحدودة",
  },
  {
    id: "c2",
    name: "فاطمة علي",
    email: "fatima@example.com",
    phone: "+966500000002",
    status: "lead",
    lastInteraction: "2024-03-19",
    company: "حلول الويب الذكية",
  },
];

export const mockInteractions = [
  {
    id: "i1",
    contactId: "c1",
    type: "email",
    date: "2024-03-15",
    notes: "تم إرسال عرض أسعار للدورة التدريبية",
    outcome: "positive",
  },
  {
    id: "i2",
    contactId: "c2",
    type: "call",
    date: "2024-03-18",
    notes: "مكالمة متابعة للعرض المقدم",
    outcome: "pending",
  },
];
