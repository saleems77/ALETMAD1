import React from 'react';

const StatCard = ({ title, value, trend, icon, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold" style={{ color }}>
            {value}
          </span>
          {trend && (
            <span 
              className="text-sm"
              style={{ color: trend.startsWith('+') ? '#008DCB' : '#E2101E' }}
            >
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className="p-2 rounded-lg" style={{ backgroundColor: color + '10' }}>
        {icon}
      </div>
    </div>
  </div>
);

export default StatCard;