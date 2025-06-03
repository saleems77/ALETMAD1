'use client';
import { useState } from 'react'; // أضف هذا الاستيراد

import { FaTimes } from 'react-icons/fa';

const TaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...taskData,
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold">إضافة مهمة جديدة</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-medium">عنوان المهمة</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={taskData.title}
                onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block font-medium">الأولوية</label>
              <select
                className="select select-bordered w-full"
                value={taskData.priority}
                onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
              >
                <option value="critical">حرجة</option>
                <option value="high">عالية</option>
                <option value="medium">متوسطة</option>
                <option value="low">منخفضة</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block font-medium">تاريخ الاستحقاق</label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={taskData.dueDate}
                onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block font-medium">تعيين إلى</label>
              <select
                className="select select-bordered w-full"
                value={taskData.assignedTo}
                onChange={(e) => setTaskData({...taskData, assignedTo: e.target.value})}
              >
                <option value="">اختر الفريق</option>
                <option value="فريق التقنية">فريق التقنية</option>
                <option value="فريق الدعم">فريق الدعم</option>
                <option value="فريق الإدارة">فريق الإدارة</option>
                <option value="فريق الجودة">فريق الجودة</option>
              </select>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <label className="block font-medium">الوصف</label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows="4"
                value={taskData.description}
                onChange={(e) => setTaskData({...taskData, description: e.target.value})}
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary">
              حفظ المهمة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;