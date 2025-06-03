'use client';
import { useForm } from 'react-hook-form';

export default function EmailTemplateForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    localStorage.setItem('emailTemplates', JSON.stringify([...getTemplates(), data]));
    alert('تم حفظ القالب بنجاح!');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label>عنوان القالب</label>
        <input {...register('title')} className="w-full p-3 border rounded-lg" required />
      </div>
      <div>
        <label>محتوى القالب</label>
        <textarea 
          {...register('content')} 
          rows="8"
          className="w-full p-3 border rounded-lg"
          required
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
        حفظ القالب
      </button>
    </form>
  );
}