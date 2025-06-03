// ResultsPage.jsx
"use client"; // ← ضروري لاستخدام React Hooks

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { getResults } from './mocks/results';

const ResultsPage = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // جلب البيانات الوهمية
    setResults(getResults());
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">نتائج التقييمات</h2>
      <BarChart width={600} height={300} data={results}>
        <XAxis dataKey="question" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="averageRating" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default ResultsPage;