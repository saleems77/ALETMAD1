'use client';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaPlus, FaSearch, FaCalendarAlt, FaUsers, FaTools, FaChartPie } from 'react-icons/fa';
import TaskModal from './TaskModal';

const TasksManager = () => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: '1', title: 'تحديث بيانات النظام', priority: 'high', dueDate: '2024-04-15', assignedTo: 'فريق التقنية' },
      { id: '2', title: 'جدولة اجتماع فريق الدعم', priority: 'medium', dueDate: '2024-04-10', assignedTo: 'فريق الإدارة' }
    ],
    inProgress: [
      { id: '3', title: 'صيانة الخادم الرئيسي', priority: 'critical', dueDate: '2024-04-05', assignedTo: 'فريق التقنية' }
    ],
    done: [
      { id: '4', title: 'تحديث سياسة الأمان', priority: 'low', dueDate: '2024-04-01', assignedTo: 'فريق الجودة' }
    ]
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // فلترة المهام حسب البحث والتصفية
  const filteredTasks = {
    todo: filterTasks(tasks.todo),
    inProgress: filterTasks(tasks.inProgress),
    done: filterTasks(tasks.done)
  };

  function filterTasks(taskList) {
    return taskList.filter(task => 
      task.title.includes(searchQuery) && 
      (filter === 'all' || task.priority === filter)
    );
  }

  const onDragEnd = (result) => {
    const { source, destination } = result;
    
    if (!destination) return;
    
    const sourceList = [...tasks[source.droppableId]];
    const [removed] = sourceList.splice(source.index, 1);
    const destList = [...tasks[destination.droppableId]];
    
    destList.splice(destination.index, 0, removed);
    
    setTasks({
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList
    });
  };

  const addTask = (newTask) => {
    setTasks({
      ...tasks,
      todo: [...tasks.todo, {
        ...newTask,
        id: Date.now().toString()
      }]
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
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
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
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
            <FaPlus /> إضافة مهمة
          </button>
        </div>
      </div>

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
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 rounded-lg shadow-sm cursor-move ${
                              task.priority === 'critical' ? 'bg-red-50 border-l-4 border-red-500' :
                              task.priority === 'high' ? 'bg-orange-50 border-l-4 border-orange-500' :
                              'bg-white border-l-4 border-blue-500'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{task.title}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {getPriorityLabel(task.priority)}
                              </span>
                            </div>
                            
                            <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt />
                                <span>{task.dueDate}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaUsers />
                                <span>{task.assignedTo}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* إحصائيات المهام */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-red-500">
          <div className="flex items-center gap-3">
            <FaTools className="text-red-500" />
            <div>
              <h3 className="text-gray-500">المهام الحرجة</h3>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-blue-500">
          <div className="flex items-center gap-3">
            <FaChartPie className="text-blue-500" />
            <div>
              <h3 className="text-gray-500">المهام الكلية</h3>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-yellow-500" />
            <div>
              <h3 className="text-gray-500">مستحقة اليوم</h3>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-t-4 border-green-500">
          <div className="flex items-center gap-3">
            <FaUsers className="text-green-500" />
            <div>
              <h3 className="text-gray-500">مكتملة هذا الأسبوع</h3>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* نموذج إضافة مهمة */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTask}
      />
    </div>
  );
};

// وظائف مساعدة
function getColumnTitle(columnId) {
  switch(columnId) {
    case 'todo': return 'قيد الانتظار';
    case 'inProgress': return 'قيد التنفيذ';
    case 'done': return 'مكتملة';
    default: return columnId;
  }
}

function getPriorityLabel(priority) {
  switch(priority) {
    case 'critical': return 'حرجة';
    case 'high': return 'عالية';
    case 'medium': return 'متوسطة';
    case 'low': return 'منخفضة';
    default: return priority;
  }
}

export default TasksManager;