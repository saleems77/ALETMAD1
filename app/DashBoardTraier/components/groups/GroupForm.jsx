'use client';

import { ErrorMessage, Field, useFormikContext } from 'formik';
import { TagIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

export default function GroupForm() {
  const { values, setFieldValue } = useFormikContext();

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFieldValue('tags', tags);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">اسم المجموعة</label>
        <Field
          name="name"
          className="w-full p-3 border rounded-lg"
          placeholder="أدخل اسم المجموعة"
        />
        <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">الوصف</label>
        <Field
          as="textarea"
          name="description"
          rows="4"
          className="w-full p-3 border rounded-lg"
          placeholder="وصف المجموعة وأهدافها..."
        />
        <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">الوسوم</label>
        <div className="relative">
          <Field
            name="tagsInput"
            className="w-full p-3 border rounded-lg pl-10"
            placeholder="أدخل الوسوم مفصولة بفواصل"
            onChange={handleTagsChange}
          />
          <TagIcon className="w-5 h-5 absolute left-3 top-4 text-gray-400" />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          الوسوم المضافة: {values.tags.join(', ')}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setFieldValue('isPrivate', !values.isPrivate)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            values.isPrivate 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}
        >
          {values.isPrivate ? (
            <>
              <LockClosedIcon className="w-5 h-5" />
              <span>خاصة</span>
            </>
          ) : (
            <>
              <LockOpenIcon className="w-5 h-5" />
              <span>عامة</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
