'use client';
import { useState } from 'react';

export default function GroupFilters({ onFilter }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'جميع المجموعات' },
    { id: 'public', label: 'المجموعات العامة' },
    { id: 'private', label: 'المجموعات الخاصة' }
  ];

  const handleFilter = (filterId) => {
    setActiveFilter(filterId);
    onFilter(filterId);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => handleFilter(filter.id)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === filter.id 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}