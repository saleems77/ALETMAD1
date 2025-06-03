import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PageViewsChart = ({ data }) => {
  const formatDate = (date) => 
    new Date(date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });

  return (
    <div className="page-views-chart bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">زيارات الصفحات خلال 30 يومًا</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: '#6B7280' }}
            />
            <YAxis tick={{ fill: '#6B7280' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => [value.toLocaleString(), 'الزيارات']}
              labelFormatter={formatDate}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PageViewsChart;