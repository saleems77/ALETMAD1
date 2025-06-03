'use client';

import { Formik, Form } from 'formik';
import GroupForm from './GroupForm';
import validationSchema from './validationSchema';

export default function CreateGroupModal({ onClose }) {
  const initialValues = {
    name: '',
    description: '',
    isPrivate: false,
    tags: [],
  };

  const handleSubmit = (values) => {
    console.log('New Group:', values);
    onClose();
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">إنشاء مجموعة جديدة</h2>
            <GroupForm />
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إنشاء المجموعة
              </button>
            </div>
          </div>
        </div>
      </Form>
    </Formik>
  );
}
