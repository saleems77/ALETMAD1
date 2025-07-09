// app/components/Support/TasksManager.jsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { FaTasks, FaUser, FaPlus, FaFilter, FaEdit, FaSync, FaCalendarAlt, FaSearch, FaTrash, FaCheck, FaClock } from 'react-icons/fa';

export default function TasksManager()  {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    roleType: '',
    statu: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    roleType: '',
    searchQuery: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // استخدام المتغير البيئي
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';

  // وظائف الترجمة للغة العربية
  const translateStatus = (status) => {
    const translations = {
      'todo': 'معلقة',
      'inProgress': 'قيد التنفيذ',
      'done': 'منتهية'
    };
    return translations[status] || status;
  };

  const translateRoleType = (roleType) => {
    const translations = {
      'technician': 'فني',
      'support': 'دعم',
      'management': 'إدارة',
      'quality': 'جودة'
    };
    return translations[roleType] || roleType;
  };

  const translatePriority = (priority) => {
    const translations = {
      'critical': 'حرجة',
      'high': 'عالية',
      'medium': 'متوسطة',
      'low': 'منخفضة'
    };
    return translations[priority] || priority;
  };

  // جلب المستخدمين غير "authenticated"
  useEffect(() => {
    async function fetchNonAuthenticatedUsers() {
      try {
        const res = await fetch(
          `${API_URL}/users?populate=role&filters[role][type][$not][$in][0]=authenticated&filters[role][type][$not][$in][1]=plattformadmin`
        );

        if (!res.ok) {
          throw new Error(`فشل في جلب المستخدمين: ${res.statusText}`);
        }

        const result = await res.json();

        if (!Array.isArray(result)) {
          throw new Error('البيانات المستقبلة غير صحيحة - يجب أن تكون مصفوفة');
        }

        setUsers(result);
      } catch (err) {
        console.error('حدث خطأ أثناء جلب المستخدمين:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNonAuthenticatedUsers();
  }, [API_URL]);

  // جلب المهام المرتبطة بمستخدم معين
  const fetchUserTasks = async (userDocumentId) => {
    try {
      const res = await fetch(
        `${API_URL}/tasks?filters[users_permissions_user][documentId][$eq]=${userDocumentId}&populate=users_permissions_user`
      );

      if (!res.ok) {
        throw new Error('فشل في جلب المهام');
      }

      const result = await res.json();

      if (!Array.isArray(result.data)) {
        throw new Error('البيانات المستقبلة غير صحيحة - يجب أن تكون مصفوفة');
      }

      setTasks(result.data);
    } catch (err) {
      console.error('حدث خطأ أثناء جلب المهام:', err.message);
      alert(`فشل في جلب المهام: ${err.message}`);
    }
  };

  // جلب جميع المهام
  const fetchAllTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks?populate=users_permissions_user`);

      if (!res.ok) {
        throw new Error('فشل في جلب جميع المهام');
      }

      const result = await res.json();

      if (!Array.isArray(result.data)) {
        throw new Error('البيانات المستقبلة غير صحيحة - يجب أن تكون مصفوفة');
      }

      setAllTasks(result.data);
    } catch (err) {
      console.error('حدث خطأ أثناء جلب جميع المهام:', err.message);
      alert(`فشل في جلب جميع المهام: ${err.message}`);
    }
  };

  // جلب جميع المهام عند تحميل المكون
  useEffect(() => {
    fetchAllTasks();
  }, [API_URL]);

  // تحديث المهام عند اختيار مستخدم جديد
  useEffect(() => {
    if (selectedUser) {
      fetchUserTasks(selectedUser.documentId);
      setActiveTab('user');
    } else {
      setTasks([]);
    }
  }, [selectedUser, API_URL]);

  // تحديث بيانات النموذج
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  // إرسال مهمة جديدة
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      alert('يرجى اختيار مستخدم قبل إرسال المهمة');
      return;
    }

    if (!taskData.title || !taskData.priority || !taskData.roleType || !taskData.statu) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            ...taskData,
            users_permissions_user: selectedUser.documentId,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`فشل في إرسال المهمة: ${JSON.stringify(errorData)}`);
      }

      alert('تم إرسال المهمة بنجاح');
      setTaskData({
        title: '',
        description: '',
        priority: '',
        dueDate: '',
        roleType: '',
        statu: ''
      });
      setSelectedUser(null);

      // تحديث البيانات
      await fetchUserTasks(selectedUser.documentId);
      await fetchAllTasks();
    } catch (err) {
      console.error('حدث خطأ أثناء إرسال المهمة:', err.message);
      alert(`فشل في إرسال المهمة: ${err.message}`);
    }
  };

  // فتح نموذج التعديل
  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      roleType: task.roleType,
      statu: task.statu
    });
  };

  // حفظ التعديلات على مهمة موجودة
  const handleUpdateTask = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/${editingTask.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            ...taskData,
            users_permissions_user: selectedUser.documentId,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`فشل في تعديل المهمة: ${JSON.stringify(errorData)}`);
      }

      alert('تم تعديل المهمة بنجاح');

      setTaskData({
        title: '',
        description: '',
        priority: '',
        dueDate: '',
        roleType: '',
        statu: ''
      });

      setEditingTask(null);

      await fetchUserTasks(selectedUser.documentId);
      await fetchAllTasks();
    } catch (err) {
      console.error('حدث خطأ أثناء تعديل المهمة:', err.message);
      alert(`فشل في تعديل المهمة: ${err.message}`);
    }
  };

  // حذف مهمة
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذه المهمة؟')) return;
    
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('فشل في حذف المهمة');
      }

      alert('تم حذف المهمة بنجاح');
      
      if (selectedUser) {
        await fetchUserTasks(selectedUser.documentId);
      }
      await fetchAllTasks();
    } catch (err) {
      console.error('حدث خطأ أثناء حذف المهمة:', err.message);
      alert(`فشل في حذف المهمة: ${err.message}`);
    }
  };

  // تحديث الفلاتر
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // إحصائيات المهام
  const taskStatistics = useMemo(() => {
    const stats = {
      todo: 0,
      inProgress: 0,
      done: 0,
      total: allTasks.length
    };

    allTasks.forEach(task => {
      if (task.statu === 'todo') stats.todo++;
      else if (task.statu === 'inProgress') stats.inProgress++;
      else if (task.statu === 'done') stats.done++;
    });

    return stats;
  }, [allTasks]);

  // تصفية المهام
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = !filters.status || task.statu === filters.status;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesRoleType = !filters.roleType || task.roleType === filters.roleType;
      const matchesSearch = !filters.searchQuery || 
        task.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesRoleType && matchesSearch;
    });
  }, [tasks, filters]);

  const filteredAllTasks = useMemo(() => {
    return allTasks.filter(task => {
      const matchesStatus = !filters.status || task.statu === filters.status;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesRoleType = !filters.roleType || task.roleType === filters.roleType;
      const matchesSearch = !filters.searchQuery || 
        task.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesRoleType && matchesSearch;
    });
  }, [allTasks, filters]);

  // بطاقة عرض المهمة
  const TaskCard = ({ task, onEdit, onDelete }) => {
    const statusColors = {
      todo: 'bg-gray-100 text-gray-800',
      inProgress: 'bg-yellow-100 text-yellow-800',
      done: 'bg-blue-100 text-blue-800'
    };
    
    const priorityColors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-yellow-100 text-yellow-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-gray-900">{task.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.statu]}`}>
              {translateStatus(task.statu)}
            </span>
          </div>
          
          <p className="mt-2 text-gray-600 text-sm">{task.description || 'لا يوجد وصف'}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
              {translatePriority(task.priority)}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
              {translateRoleType(task.roleType)}
            </span>
          </div>
          
          <div className="mt-3 flex items-center text-gray-500 text-sm">
            <FaCalendarAlt className="mr-1" />
            <span>{task.dueDate ? new Date(task.dueDate).toLocaleString('ar-SA') : 'غير محدد'}</span>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => onEdit(task)}
              className="text-primary-600 hover:text-primary-800 flex items-center"
            >
              <FaEdit className="mr-1" /> تعديل
            </button>
            <button
              onClick={() => onDelete(task.documentId)}
              className="text-danger-500 hover:text-danger-700 flex items-center"
            >
              <FaTrash className="mr-1" /> حذف
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      <span className="ml-3 text-gray-600">جاري التحميل...</span>
    </div>
  );
  
  if (error) return (
    <div className="bg-danger-100 border border-danger-500 text-danger-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">خطأ! </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );

  return (
    <div className="tasks-manager">
      {/* شريط العنوان والإحصائيات */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-800 text-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <FaTasks className="mr-2" /> مدير المهام
          </h1>
          <button 
            onClick={fetchAllTasks}
            className="bg-white text-primary-600 px-4 py-2 rounded-md flex items-center hover:bg-gray-100 transition-colors"
          >
            <FaSync className="mr-2" /> تحديث البيانات
          </button>
        </div>
        
        {/* بطاقات الإحصائيات المحسنة */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* بطاقة إجمالي المهام */}
          <div className="bg-white border border-primary-100 rounded-xl shadow-lg p-5 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary-500 bg-opacity-10 rounded-full"></div>
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-lg mr-4">
                <FaTasks className="text-primary-600 text-xl" />
              </div>
              <div>
                <div className="text-sm text-gray-500">إجمالي المهام</div>
                <div className="text-2xl font-bold mt-1 text-primary-600">{taskStatistics.total}</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                جميع المهام في النظام
              </span>
            </div>
          </div>
          
          {/* بطاقة المهام المعلقة */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gray-500 bg-opacity-10 rounded-full"></div>
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-lg mr-4">
                <FaClock className="text-gray-600 text-xl" />
              </div>
              <div>
                <div className="text-sm text-gray-500">المهام المعلقة</div>
                <div className="text-2xl font-bold mt-1 text-gray-700">{taskStatistics.todo}</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                في انتظار التنفيذ
              </span>
            </div>
          </div>
          
          {/* بطاقة قيد التنفيذ */}
          <div className="bg-white border border-warning-100 rounded-xl shadow-lg p-5 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-warning-500 bg-opacity-10 rounded-full"></div>
            <div className="flex items-center">
              <div className="bg-warning-100 p-3 rounded-lg mr-4">
                <FaSync className="text-warning-500 text-xl" />
              </div>
              <div>
                <div className="text-sm text-gray-500">قيد التنفيذ</div>
                <div className="text-2xl font-bold mt-1 text-warning-500">{taskStatistics.inProgress}</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-warning-500 bg-warning-50 px-2 py-1 rounded-full">
                قيد المعالجة
              </span>
            </div>
          </div>
          
          {/* بطاقة المهام المنتهية */}
          <div className="bg-white border border-green-100 rounded-xl shadow-lg p-5 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 bg-opacity-10 rounded-full"></div>
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <FaCheck className="text-green-600 text-xl" />
              </div>
              <div>
                <div className="text-sm text-gray-500">المنتهية</div>
                <div className="text-2xl font-bold mt-1 text-green-600">{taskStatistics.done}</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                تم الانتهاء بنجاح
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* شريط البحث والتصفية */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              name="searchQuery"
              value={filters.searchQuery}
              onChange={handleFilterChange}
              placeholder="ابحث في المهام..."
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center transition-colors"
            >
              <FaFilter className="mr-2" /> {showFilters ? 'إخفاء الفلاتر' : 'عرض الفلاتر'}
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">حالة المهمة</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">جميع الحالات</option>
                <option value="todo">معلقة</option>
                <option value="inProgress">قيد التنفيذ</option>
                <option value="done">منتهية</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع المهمة</label>
              <select
                name="roleType"
                value={filters.roleType}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">جميع الأنواع</option>
                <option value="technician">فني</option>
                <option value="support">دعم</option>
                <option value="management">إدارة</option>
                <option value="quality">جودة</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الأولوية</label>
              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">جميع الأولويات</option>
                <option value="critical">حرجة</option>
                <option value="high">عالية</option>
                <option value="medium">متوسطة</option>
                <option value="low">منخفضة</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* تبويبات التنقل */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'all' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('all')}
        >
          جميع المهام
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'users' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('users')}
        >
          المستخدمون
        </button>
        {selectedUser && (
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'user-tasks' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('user-tasks')}
          >
            مهام المستخدم
          </button>
        )}
        {(selectedUser && (activeTab === 'add' || editingTask)) && (
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'add' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('add')}
          >
            {editingTask ? 'تعديل المهمة' : 'إضافة مهمة'}
          </button>
        )}
      </div>

      {/* محتوى التبويبات */}
      <div className="tab-content">
        {activeTab === 'all' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">جميع المهام</h2>
              <span className="text-sm text-gray-500">
                عرض {filteredAllTasks.length} من {allTasks.length} مهمة
              </span>
            </div>
            
            {filteredAllTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">لا توجد مهام تطابق معايير البحث</div>
                <button 
                  onClick={() => setFilters({ status: '', priority: '', roleType: '', searchQuery: '' })}
                  className="text-primary-600 hover:text-primary-800"
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAllTasks.map((task) => (
                  <TaskCard 
                    key={task.documentId} 
                    task={task} 
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">المستخدمون المتاحون للمهام</h2>

            {users.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-500 mb-4">لا يوجد مستخدمون متاحون حالياً</div>
                <button 
                  onClick={() => fetchNonAuthenticatedUsers()}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  تحديث القائمة
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                  <div
                    key={user.documentId}
                    className={`bg-white rounded-lg shadow-md border p-4 transition-all cursor-pointer ${
                      selectedUser?.documentId === user.documentId 
                        ? 'ring-2 ring-primary-600 border-primary-600' 
                        : 'border-gray-200 hover:shadow-lg'
                    }`}
                    onClick={() => {
                      setSelectedUser(user);
                      setActiveTab('user-tasks');
                    }}
                  >
                    <div className="flex items-center">
                      <div className="bg-primary-100 text-primary-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        <FaUser />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">
                          {user.role?.name || 'لا يوجد اسم للدور'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      نوع الدور: <span className="font-semibold">{user.role?.type || 'غير محدد'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'user-tasks' && selectedUser && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                مهام المستخدم: <span className="text-primary-600">{selectedUser.username}</span>
              </h2>
              <button 
                onClick={() => {
                  setSelectedUser(null);
                  setActiveTab('users');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                تغيير المستخدم
              </button>
            </div>
            
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setTaskData({
                    title: '',
                    description: '',
                    priority: '',
                    dueDate: '',
                    roleType: '',
                    statu: ''
                  });
                  setActiveTab('add');
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-primary-700 transition-colors"
              >
                <FaPlus className="mr-2" /> إضافة مهمة جديدة
              </button>
            </div>
            
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">لا توجد مهام لهذا المستخدم بعد</div>
                <button
                  onClick={() => setActiveTab('add')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  إضافة المهمة الأولى
                </button>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">لا توجد مهام تطابق معايير البحث</div>
                <button 
                  onClick={() => setFilters({ status: '', priority: '', roleType: '', searchQuery: '' })}
                  className="text-primary-600 hover:text-primary-800"
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <TaskCard 
                    key={task.documentId} 
                    task={task} 
                    onEdit={(task) => {
                      handleEditTask(task);
                      setActiveTab('add');
                    }}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (selectedUser || editingTask) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingTask ? 'تعديل المهمة' : 'إضافة مهمة جديدة'} 
              {selectedUser && !editingTask && (
                <span> للمستخدم: <span className="text-primary-600">{selectedUser.username}</span></span>
              )}
            </h2>
            
            <form onSubmit={editingTask ? handleUpdateTask : handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المهمة *</label>
                  <input
                    type="text"
                    name="title"
                    value={taskData.title}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="أدخل عنوان المهمة"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                  <input
                    type="text"
                    name="description"
                    value={taskData.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="أدخل وصف المهمة"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الأولوية *</label>
                  <select
                    name="priority"
                    value={taskData.priority}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="">اختر الأولوية</option>
                    <option value="critical">حرجة</option>
                    <option value="high">عالية</option>
                    <option value="medium">متوسطة</option>
                    <option value="low">منخفضة</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نوع المهمة *</label>
                  <select
                    name="roleType"
                    value={taskData.roleType}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="">اختر نوع المهمة</option>
                    <option value="technician">فني</option>
                    <option value="support">دعم</option>
                    <option value="management">إدارة</option>
                    <option value="quality">جودة</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحالة *</label>
                  <select
                    name="statu"
                    value={taskData.statu}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="">اختر الحالة</option>
                    <option value="todo">معلقة</option>
                    <option value="inProgress">قيد التنفيذ</option>
                    <option value="done">منتهية</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوقت المحدد</label>
                  <input
                    type="datetime-local"
                    name="dueDate"
                    value={taskData.dueDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTask(null);
                    setTaskData({
                      title: '',
                      description: '',
                      priority: '',
                      dueDate: '',
                      roleType: '',
                      statu: ''
                    });
                    setActiveTab(selectedUser ? 'user-tasks' : 'users');
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  {editingTask ? 'تحديث المهمة' : 'حفظ المهمة'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}