// ResultsPage.js
"use client";
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { DataTable } from './DataTable';
import { Loader2, AlertCircle,BarChart3  } from 'lucide-react';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
      const token = localStorage.getItem('jwt');

      const res = await fetch(`${strapiUrl}/submissions?populate[question_assessment][fields][0]=title`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('فشل في جلب البيانات');
      const { data } = await res.json();
      
      if (!data || data.length === 0) {
        setResults([]);
        return;
      }
      
      const aggregatedResults = data.reduce((acc, submission) => {
        const questionTitle = submission.attributes.question_assessment?.data?.attributes?.title;
        const rating = submission.attributes.rating;

        if (questionTitle && typeof rating === 'number') {
          if (!acc[questionTitle]) {
            acc[questionTitle] = { total: 0, count: 0 };
          }
          acc[questionTitle].total += rating;
          acc[questionTitle].count++;
        }
        return acc;
      }, {});
      
      const chartData = Object.keys(aggregatedResults).map(question => ({
        question,
        averageRating: aggregatedResults[question].count > 0 
          ? aggregatedResults[question].total / aggregatedResults[question].count 
          : 0
      }));
      
      setResults(chartData);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'question', header: 'السؤال' },
    { 
      accessorKey: 'averageRating', 
      header: 'التقييم المتوسط (من 5)',
      cell: ({ row }) => {
        const rating = row.original.averageRating;
        return (
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg text-blue w-12 text-center">{rating.toFixed(2)}</span>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue h-2.5 rounded-full" 
                style={{ width: `${(rating / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        );
      }
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={32} className="animate-spin text-blue" />
        <span className="ml-4 text-lg text-gray">جاري تحميل النتائج...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-red/10 text-red rounded-lg">
        <AlertCircle size={32} />
        <span className="mt-4 text-lg font-semibold">حدث خطأ</span>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  if (results.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-gray-100 text-gray-500 rounded-lg">
        <BarChart3 size={40} />
        <span className="mt-4 text-lg font-semibold">لا توجد نتائج لعرضها</span>
        <p className="text-sm">لم يقم أي طالب بإكمال التقييمات بعد.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-black mb-2">ملخص نتائج التقييمات</h2>
        <p className="text-gray mb-4">عرض بياني لمتوسط التقييمات لكل سؤال عبر جميع المشاركات.</p>
        <div className="w-full h-80 p-4 bg-white rounded-lg border">
          <ResponsiveContainer>
            <BarChart data={results} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="question" tick={{ fontSize: 12 }} />
              <YAxis domain={[0][5]} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: 'rgba(0, 141, 203, 0.1)' }}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="averageRating" name="متوسط التقييم" fill="#008DCB" radius={[4][4][0][0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold text-black mb-2">النتائج التفصيلية</h3>
        <p className="text-gray mb-4">جدول يوضح متوسط التقييم لكل سؤال بشكل دقيق.</p>
        <DataTable columns={columns} data={results} />
      </div>
    </div>
  );
};

export default ResultsPage;
