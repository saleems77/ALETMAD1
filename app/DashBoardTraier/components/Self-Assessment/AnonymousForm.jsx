import { useState } from 'react';
import { useRouter } from 'next/router';
import { RadioGroup, Textarea } from '@/components/ui';

const AnonymousForm = () => {
  const router = useRouter();
  const { assessmentId } = router.query;
  const [responses, setResponses] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // إرسال التقييم إلى الـ API الوهمي
    console.log('تقييم مجهول:', { assessmentId, responses });
    router.push('/thank-you');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">تقييم الدورة</h2>
      <div className="space-y-4">
        <RadioGroup
          name="rating"
          options={[
            { label: '★', value: '1' },
            { label: '★★', value: '2' },
            { label: '★★★', value: '3' },
            { label: '★★★★', value: '4' },
            { label: '★★★★★', value: '5' },
          ]}
          onChange={(value) => setResponses({ ...responses, rating: value })}
        />
        <Textarea
          placeholder="ملاحظات إضافية..."
          onChange={(e) => setResponses({ ...responses, comment: e.target.value })}
        />
      </div>
      <Button type="submit" className="mt-4">
        إرسال التقييم
      </Button>
    </form>
  );
};

export default AnonymousForm;