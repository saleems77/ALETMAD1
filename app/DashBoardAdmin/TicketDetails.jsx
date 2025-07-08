"use client"
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTicket } from '@/store/slices/authSlice';

const TicketDetails = ({ ticket }) => {
  const dispatch = useDispatch();
  const [adminReply, setAdminReply] = useState(ticket.adminReply || "");
  const [status, setStatus] = useState(ticket.statu || "'مفتوحة'");

  const handleSubmit = () => {
    dispatch(updateTicket({
      documentId: ticket.documentId,
      updateData: {
        adminReply,
        statu: status
      }
    }));
  };

  return (
    <div 
      className="text-blue-600 hover:text-blue-800"
      onClick={() => document.getElementById(`modal-${ticket.documentId}`).showModal()}
    >
      عرض التفاصيل
      <dialog id={`modal-${ticket.documentId}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">تفاصيل التذكرة</h3>
          <div className="space-y-4">
            <p><strong>المستخدم:</strong> {ticket.users_permissions_user?.username}</p>
            <p><strong>المحتوى:</strong> {ticket.content}</p>
            <div>
              <label className="label">الحالة</label>
              <select 
                className="select select-bordered w-full"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="'مفتوحة'">مفتوحة</option>
                <option value="'مغلقة'">مغلقة</option>
              </select>
            </div>
            <div>
              <label className="label">الرد الإداري</label>
              <textarea 
                className="textarea textarea-bordered w-full"
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                حفظ التغييرات
              </button>
              <form method="dialog">
                <button className="btn">إغلاق</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default TicketDetails;