// components/ui/Card.jsx
import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, className }) => (
  <div className={`mb-4 ${className}`}>
    <h3 className="text-lg font-semibold">{title}</h3>
  </div>
);

export const CardContent = ({ children }) => (
  <div className="space-y-4">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h2 className="text-xl font-bold mb-2">{children}</h2>
);