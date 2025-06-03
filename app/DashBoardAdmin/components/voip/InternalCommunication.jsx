'use client';
import { useState, useEffect, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';
// أضف FaPlus إلى قائمة الاستيرادات
import { FaComments, FaUsers, FaCalendarAlt, FaFileAlt, FaPaperPlane, 
    FaSearch, FaBell, FaVideo, FaFileDownload, FaTrash, 
    FaEdit, FaCheck, FaTimes, FaExclamationCircle, FaPlus } from 'react-icons/fa';

const InternalCommunication = () => {
  // الحالات الأساسية
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [reports, setReports] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [messageParent] = useAutoAnimate();
  const messagesEndRef = useRef(null);

  // بيانات أولية
  useEffect(() => {
    const initialMessages = [
      { 
        id: 1, 
        from: 'فريق التسويق', 
        content: 'نحتاج موافقتكم على الإعلان الجديد بحلول يوم الخميس', 
        date: '2024-04-10', 
        time: '10:30 ص', 
        read: false,
        attachments: ['ad_design.pdf']
      },
      { 
        id: 2, 
        from: 'فريق الدعم', 
        content: 'تم حل مشكلة الخادم الرئيسي بنجاح', 
        date: '2024-04-09', 
        time: '03:45 م', 
        read: true,
        urgent: true
      }
    ];

    const initialMeetings = [
      { 
        id: 1, 
        title: 'اجتماع التخطيط الشهري', 
        date: '2024-04-15', 
        time: '11:00 ص', 
        duration: '1 ساعة',
        location: 'القاعة الرئيسية',
        attendees: ['الإدارة', 'التسويق', 'الدعم'], 
        minutes: 'تمت مناقشة الأهداف الشهرية وتحليل النتائج',
        agenda: ['مراجعة الأداء', 'تحديد الأهداف', 'توزيع المهام'],
        videoLink: 'https://meet.example.com/xyz123'
      }
    ];

    const initialReports = [
      {
        id: 1,
        title: 'تقرير الأداء الشهري',
        type: 'أداء',
        date: '2024-04-01',
        author: 'فريق التحليل',
        status: 'approved',
        file: 'performance_report_april.pdf'
      }
    ];

    setMessages(initialMessages);
    setMeetings(initialMeetings);
    setReports(initialReports);
    setUnreadCount(initialMessages.filter(msg => !msg.read).length);
  }, []);

  // إرسال رسالة جديدة
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      from: 'أنا',
      content: newMessage,
      date: new Date().toLocaleDateString('ar-SA'),
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    setMessages([message, ...messages]);
    setNewMessage('');
    scrollToBottom();
  };

  // تمييز الرسائل كمقروءة
  const markAsRead = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
    setUnreadCount(unreadCount - 1);
  };

  // تصفية الرسائل
  const filteredMessages = messages.filter(msg => {
    const matchesTeam = selectedTeam === 'all' || msg.from.includes(selectedTeam);
    const matchesSearch = msg.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         msg.from.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  // التمرير إلى الأسفل
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // إضافة اجتماع جديد
  const addMeeting = (newMeeting) => {
    setMeetings([...meetings, {
      ...newMeeting,
      id: Date.now()
    }]);
    setIsMeetingModalOpen(false);
  };

  // إضافة تقرير جديد
  const addReport = (newReport) => {
    setReports([...reports, {
      ...newReport,
      id: Date.now(),
      date: new Date().toLocaleDateString('ar-SA'),
      status: 'pending'
    }]);
    setIsReportModalOpen(false);
  };

  // حذف عنصر
  const deleteItem = (type, id) => {
    if (type === 'message') {
      setMessages(messages.filter(msg => msg.id !== id));
    } else if (type === 'meeting') {
      setMeetings(meetings.filter(meeting => meeting.id !== id));
    } else {
      setReports(reports.filter(report => report.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      {/* شريط العنوان والتنقل */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">نظام التواصل الداخلي</h2>
          <p className="text-gray-500">تعزيز التعاون بين الفرق</p>
        </div>
        
        <div className="tabs tabs-boxed bg-gray-100">
          <button 
            className={`tab relative ${activeTab === 'messages' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <FaComments className="mr-2" /> الرسائل
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </button> 
          <button 
            className={`tab ${activeTab === 'meetings' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('meetings')}
          >
            <FaCalendarAlt className="mr-2" /> الاجتماعات
          </button>
          <button 
            className={`tab ${activeTab === 'reports' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FaFileAlt className="mr-2" /> التقارير
          </button>
        </div>
      </div>

      {/* محتوى التبويبات */}
      <div className="flex-1 overflow-hidden">
        {/* قسم الرسائل */}
        {activeTab === 'messages' && (
          <div className="h-full flex flex-col">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 flex gap-2">
                <select 
                  className="select select-bordered flex-shrink-0"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <option value="all">كل الفرق</option>
                  <option value="التسويق">فريق التسويق</option>
                  <option value="الدعم">فريق الدعم</option>
                  <option value="التقنية">فريق التقنية</option>
                  <option value="الإدارة">الإدارة</option>
                </select>
                
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="ابحث في الرسائل..."
                    className="input input-bordered w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div 
              className="flex-1 overflow-y-auto space-y-4 p-2"
              ref={messageParent}
            >
              <AnimatePresence>
                {filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`p-4 rounded-lg border relative ${
                      message.from === 'أنا' ? 'bg-blue-50 border-blue-200' : 
                      !message.read ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'
                    } ${message.urgent ? 'border-l-4 border-red-500' : ''}`}
                    onClick={() => !message.read && markAsRead(message.id)}
                  >
                    {message.urgent && (
                      <span className="absolute top-2 left-2 text-red-500">
                        <FaExclamationCircle />
                      </span>
                    )}
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold">{message.from}</h4>
                      <div className="text-sm text-gray-500">
                        <span>{message.date}</span>
                        <span className="mx-1">•</span>
                        <span>{message.time}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{message.content}</p>
                    
                    {message.attachments && (
                      <div className="mt-3">
                        {message.attachments.map((file, idx) => (
                          <div key={idx} className="flex items-center text-blue-600">
                            <FaFileAlt className="mr-2" />
                            <a href="#" className="hover:underline">{file}</a>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-3 flex justify-end">
                      <button 
                        className="btn btn-xs btn-ghost text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem('message', message.id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
            
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="اكتب رسالة جديدة..."
                className="input input-bordered flex-1"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                onClick={sendMessage}
                className="btn btn-primary"
                disabled={!newMessage.trim()}
              >
                <FaPaperPlane className="mr-2" /> إرسال
              </button>
            </div>
          </div>
        )}

        {/* قسم الاجتماعات */}
        {activeTab === 'meetings' && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="ابحث في الاجتماعات..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              
              <button 
                onClick={() => setIsMeetingModalOpen(true)}
                className="btn btn-primary ml-2"
              >
                <FaPlus className="mr-2" /> جدولة اجتماع
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto p-2">
              {meetings.filter(meeting => 
                meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                meeting.attendees.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
              ).map((meeting) => (
                <div key={meeting.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{meeting.title}</h3>
                    <div className="text-right">
                      <div className="badge badge-outline">{meeting.date}</div>
                      <div className="text-sm text-gray-500">{meeting.time} ({meeting.duration})</div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="font-medium flex items-center">
                      <FaUsers className="mr-2" /> الحضور:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {meeting.attendees.map((attendee, idx) => (
                        <span key={idx} className="badge badge-info">
                          {attendee}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {meeting.location && (
                    <div className="mt-2">
                      <p className="font-medium">المكان:</p>
                      <p>{meeting.location}</p>
                    </div>
                  )}
                  
                  {meeting.videoLink && (
                    <div className="mt-2">
                      <a 
                        href={meeting.videoLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        <FaVideo className="mr-2" /> انضم عبر الفيديو
                      </a>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <p className="font-medium">نقاط الاجتماع:</p>
                    <ul className="list-disc list-inside">
                      {meeting.agenda.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-3">
                    <p className="font-medium">محضر الاجتماع:</p>
                    <p className="text-gray-700 mt-1">{meeting.minutes}</p>
                  </div>
                  
                  <div className="mt-4 flex justify-end gap-2">
                    <button className="btn btn-sm btn-outline">
                      <FaEdit />
                    </button>
                    <button 
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => deleteItem('meeting', meeting.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* قسم التقارير */}
        {activeTab === 'reports' && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="ابحث في التقارير..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              
              <button 
                onClick={() => setIsReportModalOpen(true)}
                className="btn btn-primary ml-2"
              >
                <FaPlus className="mr-2" /> تقرير جديد
              </button>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>عنوان التقرير</th>
                    <th>النوع</th>
                    <th>التاريخ</th>
                    <th>المعد</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.filter(report => 
                    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    report.type.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((report) => (
                    <tr key={report.id}>
                      <td>{report.title}</td>
                      <td>
                        <span className="badge badge-outline">
                          {report.type}
                        </span>
                      </td>
                      <td>{report.date}</td>
                      <td>{report.author}</td>
                      <td>
                        <span className={`badge ${
                          report.status === 'approved' ? 'badge-success' :
                          report.status === 'rejected' ? 'badge-error' :
                          'badge-warning'
                        }`}>
                          {report.status === 'approved' ? 'مقبول' :
                           report.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {report.file && (
                            <a 
                              href="#" 
                              className="btn btn-xs btn-outline"
                              onClick={(e) => {
                                e.preventDefault();
                                // هنا يتم تنزيل الملف
                              }}
                            >
                              <FaFileDownload />
                            </a>
                          )}
                          <button 
                            className="btn btn-xs btn-outline btn-error"
                            onClick={() => deleteItem('report', report.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* نموذج جدولة اجتماع */}
      {isMeetingModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">جدولة اجتماع جديد</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              addMeeting({
                title: formData.get('title'),
                date: formData.get('date'),
                time: formData.get('time'),
                duration: formData.get('duration'),
                location: formData.get('location'),
                attendees: Array.from(e.target.elements['attendees'])
                  .filter(el => el.checked)
                  .map(el => el.value),
                agenda: formData.get('agenda').split('\n').filter(item => item.trim()),
                videoLink: formData.get('videoLink')
              });
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">عنوان الاجتماع</label>
                  <input 
                    type="text" 
                    name="title"
                    className="input input-bordered w-full" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="label">التاريخ</label>
                  <input 
                    type="date" 
                    name="date"
                    className="input input-bordered w-full" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="label">الوقت</label>
                  <input 
                    type="time" 
                    name="time"
                    className="input input-bordered w-full" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="label">المدة</label>
                  <select 
                    name="duration"
                    className="select select-bordered w-full"
                    defaultValue="1 ساعة"
                  >
                    <option>30 دقيقة</option>
                    <option>1 ساعة</option>
                    <option>1.5 ساعة</option>
                    <option>2 ساعة</option>
                  </select>
                </div>
                
                <div>
                  <label className="label">المكان</label>
                  <input 
                    type="text" 
                    name="location"
                    className="input input-bordered w-full" 
                  />
                </div>
                
                <div>
                  <label className="label">رابط الاجتماع (اختياري)</label>
                  <input 
                    type="url" 
                    name="videoLink"
                    placeholder="https://meet.example.com/..."
                    className="input input-bordered w-full" 
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="label">الحضور</label>
                  <div className="flex flex-wrap gap-4">
                    {['الإدارة', 'التسويق', 'الدعم', 'التقنية'].map((team) => (
                      <label key={team} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="attendees"
                          value={team}
                          className="checkbox checkbox-sm" 
                        />
                        <span>{team}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="label">نقاط الاجتماع (سطر لكل نقطة)</label>
                  <textarea 
                    name="agenda"
                    className="textarea textarea-bordered w-full h-24" 
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className="modal-action">
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => setIsMeetingModalOpen(false)}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  حفظ الاجتماع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نموذج إضافة تقرير */}
      {isReportModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">تقرير جديد</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              addReport({
                title: formData.get('title'),
                type: formData.get('type'),
                content: formData.get('content'),
                file: formData.get('file')?.name
              });
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">عنوان التقرير</label>
                  <input 
                    type="text" 
                    name="title"
                    className="input input-bordered w-full" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="label">نوع التقرير</label>
                  <select 
                    name="type"
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="أداء">أداء</option>
                    <option value="مالي">مالي</option>
                    <option value="فني">فني</option>
                    <option value="إداري">إداري</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="label">المحتوى</label>
                  <textarea 
                    name="content"
                    className="textarea textarea-bordered w-full h-32" 
                    required
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="label">إرفاق ملف (اختياري)</label>
                  <input 
                    type="file" 
                    name="file"
                    className="file-input file-input-bordered w-full" 
                  />
                </div>
              </div>
              
              <div className="modal-action">
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => setIsReportModalOpen(false)}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  حفظ التقرير
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalCommunication;