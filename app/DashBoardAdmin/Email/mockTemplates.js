export const emailTemplates = [
  {
    id: "et1",
    name: "ترحيب جديد",
    type: "email",
    content: "<h1>مرحبًا {الاسم}!</h1><p>شكرًا لانضمامك إلى منصتنا</p>",
    variables: ["الاسم"],
    created: "2024-03-20",
    preview: "/templates/welcome.png",
  },
];
