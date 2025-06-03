// components/SummaryCard.jsx
import React from 'react';

const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
    <span className="text-2xl text-blue-600">{icon}</span>
  </div>
);

export default SummaryCard;