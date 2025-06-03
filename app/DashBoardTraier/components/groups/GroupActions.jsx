'use client';

import React from 'react';
import { 
  UserPlusIcon, 
  UserMinusIcon, 
  PencilSquareIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline';

export default function GroupActions({ groupId, isOwner }) {
  return (
    <div className="flex items-center gap-3 mt-4">
      <button
        className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
      >
        <UserPlusIcon className="w-5 h-5" />
        <span>انضم الآن</span>
      </button>

      <button
        className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
      >
        <UserMinusIcon className="w-5 h-5" />
        <span>مغادرة</span>
      </button>

      {isOwner && (
        <>
          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
            <PencilSquareIcon className="w-5 h-5" />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
            <TrashIcon className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}
