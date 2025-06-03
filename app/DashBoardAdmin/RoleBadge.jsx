import React from 'react';

const roleColors = {
  admin: 'bg-red-100 text-red-800',
  trainer: 'bg-blue-100 text-blue-800',
  trainee: 'bg-green-100 text-green-800',
  staff: 'bg-yellow-100 text-yellow-800',
  agent: 'bg-purple-100 text-purple-800'
};

const RoleBadge = ({ role }) => (
  <span className={`px-3 py-1 rounded-full text-sm ${roleColors[role]}`}>
    {role}
  </span>
);

export default RoleBadge;