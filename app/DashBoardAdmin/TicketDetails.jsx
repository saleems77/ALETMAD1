"use client"
import React, { useState } from 'react';

const TicketDetails = ({ ticket, teams, onClose, onRespond, onAssign }) => {
  const [response, setResponse] = useState('');
  const [assignTeam, setAssignTeam] = useState('');

  const handleSubmitResponse = () => {
    if (response.trim()) {
      onRespond(ticket.id, {
        type: 'public',
        sender: 'فريق الدعم',
        message: response,
        timestamp: new Date().toISOString()
      });
      setResponse('');
    }
  };

  const handleInternalNote = () => {
    if (response.trim()) {
      onRespond(ticket.id, {
        type: 'internal',
        sender: 'فريق الدعم',
        message: response,
        timestamp: new Date().toISOString()
      });
      setResponse('');
    }
  };

  const handleAssignTeam = () => {
    if (assignTeam) {
      onAssign(ticket.id, assignTeam);
      setAssignTeam('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{ticket.subject}</h3>
            <p className="text-gray-600 mt-1">{ticket.user} - {ticket.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 text-2xl">×</button>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">المحادثة:</h4>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{ticket.user}</span>
                <span className="text-gray-500">
                  {new Date(ticket.createdAt).toLocaleString('ar-EG')}
                </span>
              </div>
              <p>{ticket.message}</p>
            </div>

            {ticket.responses.map((res, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  res.type === 'internal' 
                    ? 'bg-purple-50 border border-purple-200' 
                    : 'bg-blue-50'
                }`}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{res.sender}</span>
                  <span className="text-gray-500">
                    {new Date(res.timestamp).toLocaleString('ar-EG')}
                  </span>
                </div>
                <p>{res.message}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2">الرد على التذكرة:</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full p-2 border rounded h-24"
                  placeholder="أكتب ردك هنا..."
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSubmitResponse}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    إرسال رد
                  </button>
                  <button
                    onClick={handleInternalNote}
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    إضافة ملاحظة داخلية
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2">تحويل إلى فريق:</label>
                <div className="flex gap-2">
                  <select
                    value={assignTeam}
                    onChange={(e) => setAssignTeam(e.target.value)}
                    className="flex-1 p-2 border rounded"
                  >
                    <option value="">اختر فريق...</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignTeam}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    تحويل
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;