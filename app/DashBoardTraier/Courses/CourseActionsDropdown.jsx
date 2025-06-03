'use client';
import { useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const CourseActionsDropdown = ({ 
  courseId, 
  onDelete,
  onDuplicate,
  onToggleVisibility
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      label: 'نسخ الدورة',
      handler: () => {
        onDuplicate(courseId);
        setIsOpen(false);
      }
    },
    {
      label: 'حذف الدورة',
      handler: () => {
        onDelete(courseId);
        setIsOpen(false);
      },
      danger: true
    },
    {
      label: 'إخفاء/إظهار',
      handler: () => {
        onToggleVisibility(courseId);
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50"
          >
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.handler}
                className={`w-full px-4 py-3 text-sm text-left ${
                  action.danger 
                    ? 'text-red-600 hover:bg-red-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                } ${
                  index !== actions.length - 1 ? 'border-b' : ''
                }`}
              >
                {action.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseActionsDropdown;