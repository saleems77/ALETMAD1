'use client';
import { Draggable } from '@hello-pangea/dnd';
import { FaCalendarAlt, FaUsers } from 'react-icons/fa'; // إضافة الاستيراد المفقود

export default function DraggableTask({ task, index }) {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 rounded-lg shadow-sm cursor-move transition-all hover:shadow-md ${
            task.priority === 'critical' ? 'bg-red-50 border-l-4 border-red-500' :
            task.priority === 'high' ? 'bg-orange-50 border-l-4 border-orange-500' :
            task.priority === 'medium' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
            'bg-green-50 border-l-4 border-green-500'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-800 flex-1">{task.title}</h4>
            <span className={`px-2 py-1 text-xs rounded-full ml-2 ${
              task.priority === 'critical' ? 'bg-red-100 text-red-800' :
              task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {getPriorityLabel(task.priority)}
            </span>
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" />
              <span>{task.dueDate || 'غير محدد'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-gray-400" />
              <span className="truncate max-w-20" title={task.assignedTo || 'غير مخصص'}>
                {task.assignedTo || 'غير مخصص'}
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
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
