"use client"
import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const AdStatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock className="w-4 h-4" />
    },
    ended: {
      color: 'bg-red-100 text-red-800',
      icon: <AlertCircle className="w-4 h-4" />
    }
  };

  const statusText = {
    active: 'نشط',
    pending: 'قيد المراجعة',
    ended: 'منتهي'
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[status]?.color || 'bg-gray-100 text-gray-800'}`}>
      {statusConfig[status]?.icon || <AlertCircle className="w-4 h-4" />}
      <span>{statusText[status] || status}</span>
    </div>
  );
};

export default AdStatusBadge;
