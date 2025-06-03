"use client"
import { useGroups } from './useGroups';
import GroupList from './GroupList';
import CreateGroupModal from './CreateGroupModal';
import {useState} from 'react'
export default function GroupsPage() {
  const { groups, loading, createGroup } = useGroups();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="p-8">
      <button 
        onClick={() => setShowCreateModal(true)}
        className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        إنشاء مجموعة جديدة
      </button>

      <GroupList groups={groups} loading={loading} />

      {showCreateModal && (
        <CreateGroupModal 
          onCreate={createGroup}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}