"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';

// استيراد المكونات بشكل ديناميكي لتعطيل الـ SSR
const DragDropContext = dynamic(
  () => import('@hello-pangea/dnd').then(mod => mod.DragDropContext),
  { ssr: false, loading: () => <div>جاري التحميل...</div> }
);

const Droppable = dynamic(
  () => import('@hello-pangea/dnd').then(mod => mod.Droppable),
  { ssr: false }
);

const Draggable = dynamic(
  () => import('@hello-pangea/dnd').then(mod => mod.Draggable),
  { ssr: false }
);

export default function EditorPanel() {
  const { register } = useForm();
  const [elements, setElements] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // بعد تهيئة العميل يمكن عرض المكون
    setIsReady(true);
  }, []);

  const onDragEnd = (result) => {
    // التحقق من وجود وجهة بعد السحب
    if (!result.destination) return;

    const newItems = Array.from(elements);
    const [movedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, movedItem);
    setElements(newItems);
  };

  const addElement = (type) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type,
      content: ''
    };
    setElements(prev => [...prev, newElement]);
  };

  if (!isReady) return <div>جاري تهيئة المحرر...</div>;

  return (
    <div className="p-4 border-r">
      <div className="mb-4 flex gap-2">
        <button 
          onClick={() => addElement('text')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          إضافة نص
        </button>
        <button
          onClick={() => addElement('image')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          إضافة صورة
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable 
          droppableId="droppable"
          isDropDisabled={false}
          isCombineEnabled={false}
          ignoreContainerClipping={false}  
        >
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
            >
              {elements.map((element, index) => (
                <Draggable
                  key={element.id}
                  draggableId={element.id}
                  index={index}
                  isDragDisabled={false}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-3 border rounded bg-white shadow-sm transition-transform ${
                        snapshot.isDragging ? 'scale-105' : ''
                      }`}
                    >
                      {element.type === 'text' ? (
                        <input
                          type="text"
                          placeholder="اكتب النص هنا..."
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          {...register(`element_${element.id}`)}
                        />
                      ) : (
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full file:px-4 file:py-2 file:rounded file:border file:border-gray-300"
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
