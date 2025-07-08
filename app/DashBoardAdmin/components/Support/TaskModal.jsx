'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function TaskModal({ isOpen, onClose, onSubmit, users }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!taskData.title.trim()) {
      toast.error('يرجى إدخال عنوان المهمة');
      return;
    }

    if (!taskData.assignedTo) {
      toast.error('يرجى اختيار مستخدم لتعيين المهمة إليه');
      return;
    }
    
    try {
      await onSubmit({
        ...taskData,
        dueDate: taskData.dueDate || new Date().toISOString().split('T')[0]
      });
      
      // إعادة تعيين النموذج بعد النجاح
      setTaskData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: ''
      });
      
    } catch (error) {
      console.error('❌ خطأ في حفظ المهمة:', error);
      toast.error('فشل في حفظ المهمة');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold">إضافة مهمة جديدة</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="إغلاق"
          >
            ✖️
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* عنوان المهمة */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">
                عنوان المهمة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={taskData.title}
                onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                required
                placeholder="ادخل عنوان المهمة"
              />
            </div>
            
            {/* الأولوية */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">الأولوية</label>
              <select
                className="select select-bordered w-full"
                value={taskData.priority}
                onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
              >
                <option value="'critical'">حرجة</option>
                <option value="'high'">عالية</option>
                <option value="'medium'">متوسطة</option>
                <option value="'low'">منخفضة</option>
              </select>
            </div>
            
            {/* تاريخ الاستحقاق */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">تاريخ الاستحقاق</label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={taskData.dueDate}
                onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            {/* تعيين إلى مستخدم معين */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">
                تعيين إلى <span className="text-red-500">*</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={taskData.assignedTo}
                onChange={(e) => setTaskData({...taskData, assignedTo: e.target.value})}
                required
              >
                <option value="">اختر المستخدم</option>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <option key={user.id} value={user.documentId || user.id}>
                      {user.username} {user.role && user.role.name ? `(${user.role.name})` : ''}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>لا توجد مستخدمين متاحين</option>
                )}
              </select>
              {users && users.length === 0 && (
                <p className="text-sm text-red-500">
                  لا توجد مستخدمين مؤهلين لتعيين المهام. تواصل مع المدير لإضافة مستخدمين جدد.
                </p>
              )}
              <p className="text-xs text-gray-500">
                عدد المستخدمين المتاحين: {users ? users.length : 0}
              </p>
            </div>
            
            {/* وصف المهمة */}
            <div className="md:col-span-2 space-y-2">
              <label className="block font-medium text-gray-700">الوصف</label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows="4"
                value={taskData.description}
                onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                placeholder="ادخل وصفاً للمهمة (اختياري)"
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-ghost"
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!taskData.title.trim() || !taskData.assignedTo}
            >
              حفظ المهمة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
