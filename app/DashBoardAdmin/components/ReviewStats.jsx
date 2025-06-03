// components/ReviewStats.jsx
'use client';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useState } from 'react';

Chart.register(...registerables);

const dummyStats = {
  ratings: [4.5, 3.8, 4.2, 4.7, 4.1],
  reviews: [
    { user: 'محمد أحمد', rating: 5, comment: 'دورة رائعة جداً' },
    { user: 'فاطمة علي', rating: 4, comment: 'محتوى مفيد ولكن يحتاج تحديث' },
  ],
};

export default function ReviewStats() {
  const [stats] = useState(dummyStats);

  const chartData = {
    labels: ['التقييم ١', 'التقييم ٢', 'التقييم ٣', 'التقييم ٤', 'التقييم ٥'],
    datasets: [{
      label: 'التقييمات',
      data: stats.ratings,
      backgroundColor: '#3b82f6',
      borderWidth: 1,
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">التقييمات</h3>
        <Bar 
          data={chartData}
          options={{
            responsive: true,
            scales: {
              y: { beginAtZero: true, max: 5 }
            }
          }}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">أحدث التعليقات</h3>
        <div className="space-y-4">
          {stats.reviews.map((review, index) => (
            <div key={index} className="border-b pb-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{review.user}</span>
                <div className="flex text-yellow-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}