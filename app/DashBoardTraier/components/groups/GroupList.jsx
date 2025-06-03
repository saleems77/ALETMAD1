'use client';
import { useState } from 'react';
import GroupCard from './GroupCard';
import GroupFilters from './GroupFilters';
import GroupSearch from './GroupSearch';
import { mockGroups } from './mockGroups';

export default function GroupList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch = group.name.includes(searchQuery) || 
      group.tags.some(tag => tag.includes(searchQuery));
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'private' ? group.isPrivate : !group.isPrivate);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <GroupSearch onSearch={setSearchQuery} />
        <GroupFilters onFilter={setSelectedFilter} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}