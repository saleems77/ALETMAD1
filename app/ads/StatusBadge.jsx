// components/StatusBadge.jsx
"use client"
import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      color: 'bg-green-100 text-green-800',
      label: 'نشط'
    },
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      label: 'قيد المراجعة'
    },
    ended: {
      color: 'bg-red-100 text-red-800',
      label: 'منتهي'
    }
  };
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[status].color}`}>
      <span>{statusConfig[status].label}</span>
    </div>
  );
};

export default StatusBadge;