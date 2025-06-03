'use client';
import { Checkbox } from '@/components/ui/checkbox';

const triggers = [
  { id: 'signup', label: 'بعد التسجيل' },
  { id: 'course_complete', label: 'إتمام الدورة' },
  { id: 'payment', label: 'بعد الدفع' }
];

export default function TriggerConditions() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">شروط التشغيل التلقائي</h3>
      <div className="space-y-3">
        {triggers.map(trigger => (
          <div key={trigger.id} className="flex items-center gap-2">
            <Checkbox id={trigger.id} />
            <label htmlFor={trigger.id} className="text-sm">
              {trigger.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}