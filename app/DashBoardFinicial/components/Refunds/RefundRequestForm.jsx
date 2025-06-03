'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';

const schema = yup.object().shape({
  orderId: yup.string().required('رقم الطلب مطلوب'),
  reason: yup.string().required('السبب مطلوب').max(500),
  attachments: yup.mixed().test(
    'fileSize', 
    'الحد الأقصى لحجم الملف 2MB', 
    value => !value || (value && value.size <= 2097152)
  )
});

export default function RefundRequestForm({ onSaveRequest }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    const newRequest = {
      ...data,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    onSaveRequest(newRequest);
    
    Swal.fire({
      icon: 'success',
      title: 'تم إرسال الطلب!',
      text: 'سيتم مراجعة طلبك خلال 3 أيام عمل'
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">طلب استرجاع رسوم</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>رقم الطلب</label>
          <input
            {...register('orderId')}
            className="w-full p-2 border rounded"
          />
          {errors.orderId && <p className="text-red-500 text-sm">{errors.orderId.message}</p>}
        </div>

        <div>
          <label>سبب الاسترجاع</label>
          <textarea
            {...register('reason')}
            className="w-full p-2 border rounded h-32"
          />
          {errors.reason && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
        </div>

        <div>
          <label>المرفقات (اختياري)</label>
          <input
            type="file"
            {...register('attachments')}
            className="w-full p-2 border rounded"
            accept=".pdf,.jpg,.png"
          />
          {errors.attachments && <p className="text-red-500 text-sm">{errors.attachments.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          إرسال الطلب
        </button>
      </form>
    </div>
  );
}
