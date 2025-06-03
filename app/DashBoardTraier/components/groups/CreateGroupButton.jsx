'use client';
import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function CreateGroupButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <PlusIcon className="w-5 h-5 mr-2" />
      <span>إنشاء مجموعة جديدة</span>
    </button>
  );
}
