"use client"
import React from 'react'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

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
    expired: {
      color: 'bg-red-100 text-red-800',
      icon: <AlertCircle className="w-4 h-4" />
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[status].color}`}>
      {statusConfig[status].icon}
      <span>{status === 'active' ? 'نشط' : status === 'pending' ? 'قيد المراجعة' : 'منتهي'}</span>
    </div>
  );
};

export default AdStatusBadge;