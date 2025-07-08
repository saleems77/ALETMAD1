// app/components/SupportTickets.jsx
"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTicket, fetchAllTickets } from '@/store/slices/authSlice';

const SupportTickets = () => {
  const dispatch = useDispatch();
  const { allTickets } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchAllTickets());
      } catch (error) {
        console.error('Error loading tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [dispatch]);

  const TicketDetails = ({ ticket }) => {
    const [adminReply, setAdminReply] = useState(ticket.adminReply || "");
    const [status, setStatus] = useState(ticket.statu || "'مفتوحة'");
    const [saving, setSaving] = useState(false);
  
    const handleSubmit = async () => {
      setSaving(true);
      try {
        await dispatch(updateTicket({
          documentId: ticket.documentId,
          updateData: {
            adminReply,
            statu: status
          }
        }));
      } catch (error) {
        console.error('Error updating ticket:', error);
      } finally {
        setSaving(false);
      }
    };
  
    return (
      <div 
        className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        onClick={() => document.getElementById(`modal-${ticket.documentId}`).showModal()}
      >
        عرض التفاصيل
        <dialog id={`modal-${ticket.documentId}`} className="modal">
          <div className="modal-box bg-white rounded-xl shadow-xl max-w-3xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h3 className="font-bold text-xl text-gray-800">تفاصيل التذكرة</h3>
              <form method="dialog">
                <button className="btn btn-sm btn-circle bg-gray-100 hover:bg-gray-200 text-gray-600 border-0">
                  ✕
                </button>
              </form>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-500 mb-2">المستخدم</h4>
                  <p className="font-medium text-gray-800">{ticket.users_permissions_user?.username}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-500 mb-2">حالة التذكرة</h4>
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${
                      status === "'مفتوحة'" ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></span>
                    <p className="font-medium text-gray-800">
                      {status === "'مفتوحة'" ? "مفتوحة" : "مغلقة"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-500 mb-2">محتوى التذكرة</h4>
                <p className="text-gray-800 bg-white p-4 rounded border border-gray-200 min-h-[100px]">
                  {ticket.content}
                </p>
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">تحديث الحالة</label>
                <div className="flex space-x-3">
                  <button 
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      status === "'مفتوحة'" 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setStatus("'مفتوحة'")}
                  >
                    مفتوحة
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      status === "'مغلقة'" 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setStatus("'مغلقة'")}
                  >
                    مغلقة
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">الرد الإداري</label>
                <textarea 
                  className="textarea textarea-bordered w-full min-h-[150px] bg-white"
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <form method="dialog">
                  <button className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    إلغاء
                  </button>
                </form>
                <button 
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ التغييرات"
                  )}
                </button>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">جاري تحميل التذاكر...</p>
        </div>
      </div>
    );
  }

  if (allTickets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد تذاكر دعم</h3>
        <p className="text-gray-600 max-w-md">لم يتم إنشاء أي تذاكر دعم بعد. سيظهر هنا أي تذكرة جديدة يقدمها المستخدمون.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">إدارة تذاكر الدعم</h2>
          <p className="text-gray-600 mt-1">عرض وإدارة تذاكر الدعم الفني من المستخدمين</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span className="text-sm text-gray-600">مفتوحة</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-sm text-gray-600">مغلقة</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-gray-600 font-medium">المستخدم</th>
              <th className="px-6 py-3 text-right text-gray-600 font-medium">المحتوى</th>
              <th className="px-6 py-3 text-right text-gray-600 font-medium">الحالة</th>
              <th className="px-6 py-3 text-right text-gray-600 font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allTickets.map(ticket => (
              <tr key={ticket.documentId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{ticket.users_permissions_user?.username}</p>
                      <p className="text-sm text-gray-500">ID: {ticket.documentId.slice(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-gray-800 line-clamp-2">{ticket.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(ticket.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    ticket.statu === "'مفتوحة'" ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {ticket.statu === "'مفتوحة'" ? "مفتوحة" : "مغلقة"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <TicketDetails ticket={ticket} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          عرض {allTickets.length} من {allTickets.length} تذكرة
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            السابق
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;