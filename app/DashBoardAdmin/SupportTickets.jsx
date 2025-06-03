"use client"
import React, { useState } from 'react';
import TicketDetails from './TicketDetails';
import NewTicketForm from './NewTicketForm';

const SupportTickets = ({ tickets, teams, onUpdate }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all'
  });

  const filteredTickets = tickets.filter(ticket => {
    return (
      (filters.type === 'all' || ticket.type === filters.type) &&
      (filters.status === 'all' || ticket.status === filters.status) &&
      (filters.priority === 'all' || ticket.priority === filters.priority)
    );
  });

  const handleResponse = (ticketId, response) => {
    const updated = tickets.map(t => 
      t.id === ticketId ? {
        ...t,
        responses: [...t.responses, response],
        status: response.type === 'internal' ? 'مُحال' : 'قيد المعالجة'
      } : t
    );
    onUpdate(updated);
  };

  const handleAssign = (ticketId, teamId) => {
    const updated = tickets.map(t => 
      t.id === ticketId ? {
        ...t,
        assignedTo: teamId,
        status: 'مُحال'
      } : t
    );
    onUpdate(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة تذاكر الدعم</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => setShowNewForm(true)}
        >
          إنشاء تذكرة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select 
          className="p-2 border rounded"
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="all">جميع الأنواع</option>
          <option value="فني">فني</option>
          <option value="مالي">مالي</option>
          <option value="محتوى">محتوى</option>
        </select>

        <select
          className="p-2 border rounded"
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="all">جميع الحالات</option>
          <option value="مفتوح">مفتوح</option>
          <option value="قيد المعالجة">قيد المعالجة</option>
          <option value="مُحال">مُحال</option>
          <option value="مغلق">مغلق</option>
        </select>

        <select
          className="p-2 border rounded"
          onChange={(e) => setFilters({...filters, priority: e.target.value})}
        >
          <option value="all">جميع الأولويات</option>
          <option value="عالي">عالي</option>
          <option value="متوسط">متوسط</option>
          <option value="منخفض">منخفض</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right">المستخدم</th>
              <th className="px-6 py-3 text-right">الموضوع</th>
              <th className="px-6 py-3 text-right">النوع</th>
              <th className="px-6 py-3 text-right">الأولوية</th>
              <th className="px-6 py-3 text-right">الحالة</th>
              <th className="px-6 py-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTickets.map(ticket => (
              <tr key={ticket.id}>
                <td className="px-6 py-4">{ticket.user}</td>
                <td className="px-6 py-4">{ticket.subject}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {ticket.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    ticket.priority === 'عالي' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    ticket.status === 'مفتوح' ? 'bg-yellow-100 text-yellow-800' :
                    ticket.status === 'قيد المعالجة' ? 'bg-blue-100 text-blue-800' :
                    ticket.status === 'مُحال' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    عرض التفاصيل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <TicketDetails
          ticket={selectedTicket}
          teams={teams}
          onClose={() => setSelectedTicket(null)}
          onRespond={handleResponse}
          onAssign={handleAssign}
        />
      )}

      {showNewForm && (
        <NewTicketForm
          onClose={() => setShowNewForm(false)}
          onSubmit={(newTicket) => {
            onUpdate([...tickets, {...newTicket, id: Date.now()}]);
            setShowNewForm(false);
          }}
        />
      )}
    </div>
  );
};

export default SupportTickets;