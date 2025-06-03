export const getForumData = () => [
  {
    id: 1,
    title: "كيفية تحسين مشاركة الطلاب",
    course: "التحول الرقمي في التعليم",
    participants: 45,
    lastUpdate: "2025-04-15",
  },
  {
    id: 2,
    title: "أسئلة حول تقييم الدورات",
    course: "صناعة المحتوى الهادف",
    participants: 28,
    lastUpdate: "2025-04-14",
  },
];

export const getCourseDiscussions = () => [
  {
    id: 101,
    title: "كيف نختار أدوات التقييم المناسبة؟",
    author: "أحمد محمد",
    replies: [
      { user: "ليلى", text: "أنصح باستخدام الاختبارات التفاعلية [[10]]" },
    ],
  },
];
export const getAdminData = () => ({
  users: [
    { id: 1, name: "أحمد", role: "مدرب", activity: "نشط" },
    { id: 2, name: "ليلى", role: "طالب", activity: "غير نشط" },
  ],
  courses: [{ id: 101, title: "البرمجة المتقدمة", enrollments: 150 }],
});
