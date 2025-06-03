// app/DashBoardEmployee/components/TicketsManager.jsx

'use client';

import { useState } from 'react';
import { FaPlus, FaFilter, FaSearch, FaReply, FaExchangeAlt, FaCheckCircle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TicketsManager = () => {
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'منخفضة',
    category: 'فني'
  });
  
  const [filters, setFilters] = useState({
    status: 'الكل',
    priority: 'الكل',
    search: ''
  });

  // بيانات نموذجية للتذاكر
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: 'مشكلة في الدفع',
      user: 'أحمد محمد',
      createdAt: '2024-03-20',
      priority: 'عالية',
      status: 'مفتوحة',
      category: 'مالي',
      lastUpdated: '2024-03-21'
    },
    {
      id: 2,
      title: 'استفسار عن محتوى الدورة',
      user: 'فاطمة علي',
      createdAt: '2024-03-19',
      priority: 'متوسطة',
      status: 'قيد المعالجة',
      category: 'تعليمي',
      lastUpdated: '2024-03-20'
    }
  ]);

  // إحصائيات نموذجية
  const statsData = [
    { name: 'مفتوحة', value: 15 },
    { name: 'قيد المعالجة', value: 8 },
    { name: 'مغلقة', value: 23 }
  ];

  const handleSubmitTicket = () => {
    const newTicketData = {
      id: tickets.length + 1,
      ...newTicket,
      status: 'مفتوحة',
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setTickets([...tickets, newTicketData]);
    setShowNewTicketForm(false);
    setNewTicket({ title: '', description: '', priority: 'منخفضة', category: 'فني' });
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus } 
        : ticket
    ));
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filters.status === 'الكل' || ticket.status === filters.status;
    const matchesPriority = filters.priority === 'الكل' || ticket.priority === filters.priority;
    const matchesSearch = ticket.title.includes(filters.search) || 
                        ticket.user.includes(filters.search);
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* شريط التحكم العلوي */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة تذاكر الدعم الفني</h2>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowNewTicketForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus /> إنشاء تذكرة جديدة
          </button>
          
          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              placeholder="بحث..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* الإحصائيات والرسوم البيانية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">توزيع التذاكر</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-gray-600">التذاكر المفتوحة</p>
            <p className="text-3xl font-bold text-blue-600">15</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-gray-600">معدل الاستجابة</p>
            <p className="text-3xl font-bold text-green-600">89%</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <p className="text-gray-600">متوسط وقت الحل</p>
            <p className="text-3xl font-bold text-purple-600">2.4h</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="text-gray-600">التذاكر الجديدة</p>
            <p className="text-3xl font-bold text-yellow-600">5</p>
          </div>
        </div>
      </div>

      {/* مرشحات التذاكر */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select 
            className="p-2 border rounded-lg"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="الكل">جميع الحالات</option>
            <option value="مفتوحة">مفتوحة</option>
            <option value="قيد المعالجة">قيد المعالجة</option>
            <option value="مغلقة">مغلقة</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select 
            className="p-2 border rounded-lg"
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
          >
            <option value="الكل">جميع الأولويات</option>
            <option value="عالية">عالية</option>
            <option value="متوسطة">متوسطة</option>
            <option value="منخفضة">منخفضة</option>
          </select>
        </div>
      </div>

      {/* جدول التذاكر */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">رقم التذكرة</th>
              <th className="p-3 text-right">العنوان</th>
              <th className="p-3 text-right">المستخدم</th>
              <th className="p-3 text-right">الأولوية</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">آخر تحديث</th>
              <th className="p-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="border-t hover:bg-gray-50">
                <td className="p-3">#{ticket.id}</td>
                <td className="p-3 font-medium">{ticket.title}</td>
                <td className="p-3">{ticket.user}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full ${
                    ticket.priority === 'عالية' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'متوسطة' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="p-3">
                  <select 
                    value={ticket.status}
                    onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                    className={`bg-transparent ${
                      ticket.status === 'مفتوحة' ? 'text-blue-600' :
                      ticket.status === 'قيد المعالجة' ? 'text-orange-600' : 'text-green-600'
                    }`}
                  >
                    <option value="مفتوحة">مفتوحة</option>
                    <option value="قيد المعالجة">قيد المعالجة</option>
                    <option value="مغلقة">مغلقة</option>
                  </select>
                </td>
                <td className="p-3">{ticket.lastUpdated}</td>
                <td className="p-3 flex gap-2">
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    title="الرد"
                  >
                    <FaReply />
                  </button>
                  <button 
                    className="text-gray-600 hover:text-gray-800"
                    title="تحويل"
                  >
                    <FaExchangeAlt />
                  </button>
                  <button 
                    className="text-green-600 hover:text-green-800"
                    title="إغلاق"
                    onClick={() => updateTicketStatus(ticket.id, 'مغلقة')}
                  >
                    <FaCheckCircle />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نموذج إضافة تذكرة جديد */}
      {showNewTicketForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">إنشاء تذكرة جديدة</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1">العنوان</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block mb-1">الوصف</label>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block mb-1">الأولوية</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                >
                  <option value="منخفضة">منخفضة</option>
                  <option value="متوسطة">متوسطة</option>
                  <option value="عالية">عالية</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewTicketForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmitTicket}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsManager;