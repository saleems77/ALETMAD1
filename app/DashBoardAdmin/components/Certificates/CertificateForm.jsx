'use client';
import { Field, ErrorMessage } from 'formik';

export default function CertificateForm() {
  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 font-medium">اسم المتلقي</label>
        <Field
          name="recipientName"
          type="text"
          className="w-full p-3 border rounded-lg"
          placeholder="أدخل الاسم الكامل"
        />
        <ErrorMessage name="recipientName" component="div" className="text-red-500 mt-1" />
      </div>

      <div>
        <label className="block mb-2 font-medium">اسم الدورة</label>
        <Field
          name="courseName"
          as="select"
          className="w-full p-3 border rounded-lg"
        >
          <option value="">اختر الدورة</option>
          <option value="تطوير الويب المتقدم">تطوير الويب المتقدم</option>
          <option value="أمن المعلومات">أمن المعلومات</option>
        </Field>
        <ErrorMessage name="courseName" component="div" className="text-red-500 mt-1" />
      </div>

      <div>
        <label className="block mb-2 font-medium">تاريخ الإصدار</label>
        <Field
          name="issueDate"
          type="date"
          className="w-full p-3 border rounded-lg"
        />
        <ErrorMessage name="issueDate" component="div" className="text-red-500 mt-1" />
      </div>
    </div>
  );
}