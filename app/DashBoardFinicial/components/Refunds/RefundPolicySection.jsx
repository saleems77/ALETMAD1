'use client';
export default function RefundPolicySection() {
  const policies = [
    {
      title: 'الاسترجاع خلال 14 يومًا',
      content: 'يمكنك طلب استرجاع الرسوم خلال 14 يومًا من تاريخ الشراء'
    },
    {
      title: 'الشروط المالية',
      content: 'سيتم خصم 5% كرسوم إدارية في حال الموافقة على الاسترجاع'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">سياسة الاسترجاع</h2>

      <div className="space-y-4">
        {policies.map((policy, index) => (
          <details key={index} className="border rounded-lg p-4">
            <summary className="font-medium cursor-pointer">
              {policy.title}
            </summary>
            <p className="mt-2 text-gray-600">{policy.content}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
