// app/DashBoardEmployee/components/TicketsTable.jsx

'use client';

const TicketsTable = () => {
  const tickets = [
    { id: 1, title: 'مشكلة في الدفع', priority: 'عالية', status: 'مفتوح', date: '2024-03-15' },
    { id: 2, title: 'استفسار عن الدورة', priority: 'متوسطة', status: 'قيد المعالجة', date: '2024-03-14' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">تذاكر الدعم الفني</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + إنشاء تذكرة جديدة
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right">رقم التذكرة</th>
              <th className="px-6 py-3 text-right">العنوان</th>
              <th className="px-6 py-3 text-right">الأولوية</th>
              <th className="px-6 py-3 text-right">الحالة</th>
              <th className="px-6 py-3 text-right">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">#{ticket.id}</td>
                <td className="px-6 py-4">{ticket.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full ${
                    ticket.priority === 'عالية' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'متوسطة' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">{ticket.status}</td>
                <td className="px-6 py-4">{ticket.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketsTable;