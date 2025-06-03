import React from 'react';

const StatCard = ({ title, value, unit, color, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>
          <p className="text-3xl font-bold">
            {value}
            <span className="text-lg text-gray-500"> {unit}</span>
          </p>
        </div>
        <div className={`rounded-full p-4 ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;