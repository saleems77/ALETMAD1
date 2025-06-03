import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// تسجيل المكونات المطلوبة لـ Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AnalyticsWidget = () => {
  const data = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل'],
    datasets: [
      {
        label: 'المشاركات اليومية',
        data: [65, 59, 80, 81],
        borderColor: '#3B82F6',
        fill: false,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-4">تحليلات المشاركة [[4]]</h3>
      <Line data={data} options={{ responsive: true }} />
    </div>
  );
};

export default AnalyticsWidget;