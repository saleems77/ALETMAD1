// app/data/mock-data.js
import { faker } from "@faker-js/faker";

// ✅ تصدير مصفوفة مباشرة
export const channelsMock = [
  {
    id: faker.string.uuid(),
    type: "email",
    icon: "📧",
    name: "البريد الإلكتروني",
    count: faker.number.int({ min: 10, max: 100 }),
  },
  {
    id: faker.string.uuid(),
    type: "whatsapp",
    icon: "📱",
    name: "واتساب",
    count: faker.number.int({ min: 10, max: 100 }),
  },
  // أضف المزيد من القنوات...
];
export const customerTags = [
  { value: "vip", label: "عملاء VIP" },
  { value: "active", label: "نشط" },
  { value: "inactive", label: "غير نشط" },
  // أضف المزيد من التصنيفات...
];
export const leadsMock = Array.from({ length: 50 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  stage: faker.helpers.arrayElement(["الوعي", "الاهتمام", "الرغبة", "العمل"]),
  lastContact: faker.date.recent().toISOString(),
  source: faker.helpers.arrayElement([
    "موقع الويب",
    "واتساب",
    "البريد",
    "الفيسبوك",
  ]),
  score: faker.number.int({ min: 1, max: 100 }),
}));
