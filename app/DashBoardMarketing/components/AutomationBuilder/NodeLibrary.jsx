"use client";
import { useDraggable } from '@dnd-kit/core';
import { FaEnvelope, FaClock, FaCodeBranch } from 'react-icons/fa';

/*
  مكوّن Icon يقوم بتحديد الأيقونة المناسبة بناءً على قيمة الخاصية name.
  في هذا المثال قمنا باستخدام أيقونات من مكتبة react-icons.
*/
const Icon = ({ name, className }) => {
  switch (name) {
    case 'mail':
      return <FaEnvelope className={className} />;
    case 'clock':
      return <FaClock className={className} />;
    case 'branch':
      return <FaCodeBranch className={className} />;
    default:
      return null;
  }
};

const NodeItem = ({ type, icon, label }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `draggable-${type}`,
    data: { type }
  });

  return (
    <div 
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="node-item bg-white p-4 rounded-lg shadow-md cursor-move flex items-center space-x-2"
    >
      <Icon name={icon} className="w-6 h-6" />
      <span>{label}</span>
    </div>
  );
};

export default function NodeLibrary() {
  const nodeTypes = [
    { type: 'email', icon: 'mail', label: 'إرسال بريد' },
    { type: 'delay', icon: 'clock', label: 'تأخير' },
    { type: 'condition', icon: 'branch', label: 'شرط' }
  ];

  return (
    <div className="node-library bg-white p-4">
      {nodeTypes.map((node) => (
        <NodeItem key={node.type} {...node} />
      ))}
    </div>
  );
}
