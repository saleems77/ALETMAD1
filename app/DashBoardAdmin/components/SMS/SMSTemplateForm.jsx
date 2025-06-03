'use client';
import { useForm } from 'react-hook-form';

export default function SMSTemplateForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    localStorage.setItem('smsTemplates', JSON.stringify([...getTemplates(), data]));
    alert('تم حفظ القالب بنجاح!');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label>نص الرسالة (160 حرف كحد أقصى)</label>
        <textarea 
          {...register('content')} 
          maxLength="160"
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