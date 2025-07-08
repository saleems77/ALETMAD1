'use client';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import DraggableTask from './DraggableTask';
import TaskModal from './TaskModal';
import { fetchStrapi } from './strapiClient';
import toast, { Toaster } from 'react-hot-toast';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faChartPie, faCalendarAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

export default function TasksManager() {
  const [tasks, setTasks] = useState({
    todo: [], 
    inProgress: [], 
    done: []
  });
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 بدء تحميل البيانات...');
        
        // جلب المهام مع populate للمستخدم المُعين
        console.log('📋 جلب المهام...');
        const taskRes = await fetchStrapi('/tasks');
        console.log('✅ استجابة المهام:', taskRes);
        
        const formattedTasks = {
          todo: [],
          inProgress: [],
          done: []
        };
        
        // معالجة المهام وتصنيفها حسب الحالة
        if (taskRes.data && Array.isArray(taskRes.data)) {
          taskRes.data.forEach(task => {
            const status = task.statu || 'todo'; // استخدام 'statu' كما هو محدد في الجدول
            if (formattedTasks[status]) {
              formattedTasks[status].push({
                ...task,
                id: task.id,
                documentId: task.documentId || task.id,
                assignedTo: task.users_permissions_user?.username // استخدام الاسم الصحيح للحقل
              });
            }
          });
        }
        
        setTasks(formattedTasks);
        console.log('✅ تم تحميل المهام:', formattedTasks);

        // جلب المستخدمين - تجربة عدة طرق
        console.log('👥 بدء جلب المستخدمين...');
        
        let userRes = null;
        let eligibleUsers = [];
        
        try {
          // الطريقة الأولى: جلب جميع المستخدمين مع أدوارهم
          console.log('🔍 جلب جميع المستخدمين مع الأدوار...');
          userRes = await fetchStrapi('/users?populate=role');
          console.log('📊 بيانات المستخدمين الخام:', userRes);
          
          if (userRes.data && Array.isArray(userRes.data)) {
            // فلترة المستخدمين محلياً
            eligibleUsers = userRes.data.filter(user => {
              console.log(`👤 فحص المستخدم: ${user.username}`, 'الدور:', user.role);
              // التحقق من وجود دور وأن نوعه ليس 'authenticated'
              return user.role && user.role.type && user.role.type !== 'authenticated';
            });
            
            console.log('✅ المستخدمين المؤهلين:', eligibleUsers);
            setUsers(eligibleUsers);
          }
        } catch (userError) {
          console.error('❌ خطأ في جلب المستخدمين:', userError);
          
          // الطريقة البديلة: جلب المستخدمين بدون populate
          try {
            console.log('🔄 تجربة جلب المستخدمين بدون populate...');
            userRes = await fetchStrapi('/users');
            console.log('📊 بيانات المستخدمين بدون populate:', userRes);
            
            if (userRes.data && Array.isArray(userRes.data)) {
              // في هذه الحالة، سنأخذ جميع المستخدمين
              setUsers(userRes.data);
              console.log('✅ تم تعيين جميع المستخدمين');
            }
          } catch (fallbackError) {
            console.error('❌ فشل في جلب المستخدمين:', fallbackError);
            setUsers([]);
          }
        }
        
      } catch (error) {
        console.error('❌ خطأ عام في تحميل البيانات:', error);
        toast.error('فشل تحميل البيانات');
        setUsers([]);
      } finally {
        setIsLoading(false);
        console.log('🏁 انتهى تحميل البيانات');
      }
    };
    
    loadData();
  }, []);

  // إضافة مهمة جديدة
  const addTask = async (newTask) => {
    try {
      console.log('📝 إضافة مهمة جديدة:', newTask);
      
      const response = await fetchStrapi('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            dueDate: newTask.dueDate,
            statu: 'todo', // استخدام 'statu' كما هو محدد في الجدول
            users_permissions_user: newTask.assignedTo // استخدام الاسم الصحيح للحقل
          }
        })
      });
      
      console.log('✅ استجابة إضافة المهمة:', response);
      
      const task = {
        ...response.data,
        id: response.data.id,
        documentId: response.data.documentId || response.data.id,
        assignedTo: response.data.users_permissions_user?.username
      };
      
      setTasks(prev => ({
        ...prev,
        todo: [...prev.todo, task]
      }));
      
      toast.success('تمت إضافة المهمة بنجاح');
      setIsModalOpen(false);
      
    } catch (error) {
      console.error('❌ خطأ في إضافة المهمة:', error);
      toast.error('فشل إضافة المهمة');
    }
  };

  // تحديث حالة المهمة
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await fetchStrapi(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({
          data: { statu: newStatus } // استخدام 'statu' بدلاً من 'status'
        })
      });
      
      setTasks(prev => {
        const allTasks = { ...prev };
        const taskToUpdate = [...prev.todo, ...prev.inProgress, ...prev.done]
          .find(task => task.id === taskId);
          
        if (taskToUpdate) {
          // إزالة من الحالة القديمة
          Object.keys(allTasks).forEach(key => {
            allTasks[key] = allTasks[key].filter(t => t.id !== taskId);
          });
          
          // إضافة للحالة الجديدة
          allTasks[newStatus] = [...allTasks[newStatus], taskToUpdate];
        }
        
        return allTasks;
      });
      
    } catch (error) {
      console.error('❌ خطأ في تحديث الحالة:', error);
      toast.error('فشل تحديث الحالة');
    }
  };

  // معالجة السحب والإفلات
  const onDragEnd = (result) => {
    const { source, destination } = result;
    
    if (!destination || source.droppableId === destination.droppableId) return;
    
    updateTaskStatus(result.draggableId, destination.droppableId);
  };

  // فلترة المهام
  const filteredTasks = {
    todo: tasks.todo.filter(task => 
      task.title && task.title.includes(searchQuery) && 
      (filter === 'all' || task.priority === filter)
    ),
    inProgress: tasks.inProgress.filter(task => 
      task.title && task.title.includes(searchQuery) && 
      (filter === 'all' || task.priority === filter)
    ),
    done: tasks.done.filter(task => 
      task.title && task.title.includes(searchQuery) && 
      (filter === 'all' || task.priority === filter)
    )
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mr-4">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Toaster />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة المهام التشغيلية</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث عن المهام..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          
          <select 
            className="select select-bordered"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">جميع الأولويات</option>
            <option value="critical">حرجة</option>
            <option value="high">عالية</option>
            <option value="medium">متوسطة</option>
            <option value="low">منخفضة</option>
          </select>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus /> إضافة مهمة
          </button>
        </div>
      </div>
      
      {/* تحذير إذا لم يتم العثور على مستخدمين */}
      {users.length === 0 && !isLoading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            تحذير: لم يتم العثور على مستخدمين مؤهلين لتعيين المهام. 
            تأكد من وجود مستخدمين بأدوار غير "authenticated" في النظام.
          </p>
          <p className="text-sm text-yellow-600 mt-2">
            عدد المستخدمين المحملين: {users.length}
          </p>
        </div>
      )}

      {/* أعمدة المهام */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(filteredTasks).map(([columnId, columnTasks]) => (
            <div key={columnId} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-center">
                {getColumnTitle(columnId)}
                <span className="ml-2 bg-gray-200 px-2 py-1 rounded-full text-sm">
                  {columnTasks.length}
                </span>
              </h3>
              
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 min-h-[200px]"
                  >
                    {columnTasks.map((task, index) => (
                      <DraggableTask 
                        key={task.id} 
                        task={task} 
                        index={index} 
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      
      {/* الإحصائيات */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-red-500">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faTools} className="text-red-500" />
            <div>
              <h3 className="text-gray-500">المهام الحرجة</h3>
              <p className="text-2xl font-bold">
                {tasks.todo.filter(t => t.priority === 'critical').length + 
                 tasks.inProgress.filter(t => t.priority === 'critical').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-blue-500">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faChartPie} className="text-blue-500" />
            <div>
              <h3 className="text-gray-500">المهام الكلية</h3>
              <p className="text-2xl font-bold">
                {tasks.todo.length + tasks.inProgress.length + tasks.done.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-yellow-500" />
            <div>
              <h3 className="text-gray-500">مستحقة اليوم</h3>
              <p className="text-2xl font-bold">
                {tasks.todo.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-green-500">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faUsers} className="text-green-500" />
            <div>
              <h3 className="text-gray-500">مكتملة هذا الأسبوع</h3>
              <p className="text-2xl font-bold">
                {tasks.done.filter(t => {
                  if (!t.dueDate) return false;
                  const taskDate = new Date(t.dueDate);
                  const today = new Date();
                  const diffTime = Math.abs(today - taskDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 7;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* نموذج المهمة */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTask}
        users={users}
      />
    </div>
  );
}

// دوال مساعدة
function getColumnTitle(columnId) {
  switch(columnId) {
    case 'todo': return 'قيد الانتظار';
    case 'inProgress': return 'قيد التنفيذ';
    case 'done': return 'مكتملة';
    default: return columnId;
  }
}
