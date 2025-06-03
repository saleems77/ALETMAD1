// components/dashboard/TaskList.jsx
"use client"
import { useState } from 'react';
import Dropdown from './Dropdown';

// بيانات افتراضية
const initialTasks = [
  {
    id: 1,
    title: "مراجعة محتوى دورة الرياضيات",
    dueDate: "2024-06-01",
    status: "جارية",
    assignedBy: "أحمد محمد",
    comments: [
      { text: "يجب إضافة قسم التمارين", date: "2024-05-25" }
    ]
  },
  {
    id: 2,
    title: "تحديد مواعيد الاختبارات",
    dueDate: "2024-05-30",
    status: "متأخرة",
    assignedBy: "ليلى عبدالله",
    comments: []
  },
];

const statusColors = {
  جارية: 'bg-blue-100 text-blue-800',
  مكتملة: 'bg-green-100 text-green-800',
  متأخرة: 'bg-red-100 text-red-800'
};

const TaskCard = ({ task, onUpdateStatus, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(task.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
          <div className="mt-2 flex items-center flex-wrap gap-4">
            <div className="flex items-center text-sm">
              <span className="text-gray-500">تاريخ الاستحقاق:</span>
              <span className="font-medium ml-2 text-gray-700">
                {new Date(task.dueDate).toLocaleDateString('ar-EG')}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-gray-500">مُعين من:</span>
              <span className="font-medium ml-2 text-gray-700">
                {task.assignedBy}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-4">
        <Dropdown
  options={['جارية', 'مكتملة', 'متأخرة']}
  selected={task.status}
  onSelect={(status) => onUpdateStatus(task.id, status)}
  className={`px-3 py-1 rounded-full text-sm ${statusColors[task.status]}`}
/>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            {showComments ? 'إخفاء التعليقات' : 'عرض التعليقات'}
          </button>
        </div>
      </div>

      {showComments && (
        <div className="mt-6 border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">التعليقات</h4>
          
          {task.comments.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد تعليقات حتى الآن</p>
          ) : (
            <div className="space-y-3">
              {task.comments.map((comment, index) => (
                <div key={index} className="flex items-start bg-gray-50 p-3 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.date).toLocaleDateString('ar-EG', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="أضف تعليق جديد..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
              >
                إضافة
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');

  const handleUpdateStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleAddComment = (taskId, commentText) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { 
        ...task, 
        comments: [...task.comments, { 
          text: commentText, 
          date: new Date().toISOString() 
        }] 
      } : task
    ));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">المهام الموكلة</h2>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdateStatus={handleUpdateStatus}
            onAddComment={handleAddComment}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;