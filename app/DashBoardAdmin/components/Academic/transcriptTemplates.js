export const templates = [
  {
    id: "classic",
    name: "النموذج الكلاسيكي",
    thumbnail: "/templates/classic.jpg",
    defaultContent: `
        <h1>السجل الأكاديمي</h1>
        <p>اسم الطالب: [الاسم هنا]</p>
        <h2>المساقات المكتملة:</h2>
        <ul>
          <li>المساق 1 - التقدير: A</li>
        </ul>
      `,
  },
  {
    id: "modern",
    name: "النموذج الحديث",
    thumbnail: "/templates/modern.jpg",
    defaultContent: `
        <div class="header">
          <h1>جامعة التقنية العليا</h1>
          <h2>السجل الأكاديمي</h2>
        </div>
        <table>
          <tr><th>المساق</th><th>التقدير</th></tr>
          <tr><td>المساق 1</td><td>A</td></tr>
        </table>
      `,
  },
];
