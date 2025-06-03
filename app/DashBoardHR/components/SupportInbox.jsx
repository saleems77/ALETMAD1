// components/dashboard/SupportInbox.jsx
import { useState } from 'react';
import { Badge } from './Badge'; // مكون البادج المخصص

// بيانات افتراضية للرسائل
const initialTickets = [
  {
    id: 1,
    title: "مشكلة في تحميل الفيديو",
    sender: "محمد علي",
    date: "2024-05-28",
    status: "مفتوحة",
    priority: "عالي",
    messages: [
      {
        text: "لا أستطيع مشاهدة فيديو الوحدة الثالثة، يظهر خطأ 404",
        sender: "محمد علي",
        timestamp: "2024-05-28 10:30"
      },
      {
        text: "تم إبلاغ الفريق الفني وسيتم الحل خلال 24 ساعة",
        sender: "فريق الدعم",
        timestamp: "2024-05-28 11:45"
      }
    ]
  },
  {
    id: 2,
    title: "استفسار عن موعد الاختبار",
    sender: "أميرة حسن",
    date: "2024-05-27",
    status: "مغلقة",
    priority: "عادي",
    messages: [
      {
        text: "هل يمكن تأجيل موعد الاختبار النهائي؟",
        sender: "أميرة حسن",
        timestamp: "2024-05-27 09:15"
      }
    ]
  }
];

const statusColors = {
  مفتوحة: 'bg-orange-100 text-orange-800',
  مغلقة: 'bg-green-100 text-green-800'
};

const priorityColors = {
  عالي: 'text-red-600',
  عادي: 'text-gray-600'
};

const TicketItem = ({ ticket, isSelected, onClick }) => (
  <div 
    className={`p-4 cursor-pointer transition-colors ${
      isSelected ? 'bg-blue-50 border-r-4 border-blue-500' : 'bg-white hover:bg-gray-50'
    }`}
    onClick={onClick}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-800">{ticket.title}</h3>
          <Badge className={statusColors[ticket.status]}>
            {ticket.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{ticket.sender}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">{new Date(ticket.date).toLocaleDateString('ar-EG')}</p>
        <p className={`text-xs ${priorityColors[ticket.priority]}`}>
          {ticket.priority}
        </p>
      </div>
    </div>
  </div>
);

const MessageBubble = ({ message, isSupport }) => (
  <div className={`flex ${isSupport ? 'justify-start' : 'justify-end'} mb-4`}>
    <div className={`max-w-[70%] p-4 rounded-xl ${
      isSupport 
        ? 'bg-gray-100 text-gray-800' 
        : 'bg-blue-600 text-white'
    }`}>
      <p className="text-sm">{message.text}</p>
      <p className={`text-xs mt-2 ${
        isSupport ? 'text-gray-500' : 'text-blue-100'
      }`}>
        {new Date(message.timestamp).toLocaleString('ar-EG')}
      </p>
    </div>
  </div>
);

const SupportInbox = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [tickets, setTickets] = useState(initialTickets);

  const handleSendMessage = (ticketId) => {
    if (!newMessage.trim()) return;

    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          messages: [
            ...ticket.messages,
            {
              text: newMessage,
              sender: "المساعد",
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    setNewMessage('');
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">الرسائل والدعم</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          + تذكرة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* قائمة التذاكر */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <input 
              type="text" 
              placeholder="ابحث في التذاكر..."
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="divide-y">
            {tickets.map(ticket => (
              <TicketItem
                key={ticket.id}
                ticket={ticket}
                isSelected={selectedTicket?.id === ticket.id}
                onClick={() => setSelectedTicket(ticket)}
              />
            ))}
          </div>
        </div>

        {/* تفاصيل التذكرة */}
        {selectedTicket && (
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">{selectedTicket.title}</h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* سجل المحادثة */}
            <div className="mb-6 h-[400px] overflow-y-auto pr-4">
              {selectedTicket.messages.map((message, index) => (
                <MessageBubble 
                  key={index}
                  message={message}
                  isSupport={message.sender !== "المساعد"}
                />
              ))}
            </div>

            {/* إرسال رد */}
            <div className="border-t pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedTicket.id)}
                />
                <button
                  onClick={() => handleSendMessage(selectedTicket.id)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  إرسال
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportInbox;