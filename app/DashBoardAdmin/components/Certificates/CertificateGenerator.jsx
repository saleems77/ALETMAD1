'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import CertificatePreview from './CertificatePreview';
import validationSchema from './validationSchema';

export default function CertificateGenerator() {
  const initialValues = {
    recipientName: '',
    courseName: '',
    issueDate: new Date().toISOString().split('T')[0],
    issuerName: 'منصة التعلم العربية',
    certificateId: uuidv4()
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log('بيانات الشهادة:', values);
    resetForm();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 p-6">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-6">إنشاء شهادة جديدة</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="recipientName">اسم المتلقي</label>
                  <Field name="recipientName" className="w-full p-3 border rounded-lg" />
                  <ErrorMessage name="recipientName" component="div" className="text-red-500" />
                </div>

                <div>
                  <label htmlFor="courseName">اسم الدورة</label>
                  <Field name="courseName" className="w-full p-3 border rounded-lg" />
                  <ErrorMessage name="courseName" component="div" className="text-red-500" />
                </div>

                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                  حفظ وإنشاء الشهادة
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <CertificatePreview formValues={initialValues} />
    </div>
  );
}
