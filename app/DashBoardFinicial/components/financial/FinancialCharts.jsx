import { Chart as ChartJS } from 'chart.js';
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function FinancialCharts({ data }) {
  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'الإيرادات',
        data: data.map(d => d.totalIncome),
        backgroundColor: '#3B82F6',
      },
      {
        label: 'المصروفات',
        data: data.map(d => d.totalExpenses),
        backgroundColor: '#EF4444',
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">تحليل الأداء الشهري</h3>
      <Bar 
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { 
              rtl: true,
              position: 'top',
              labels: {
                font: {
                  family: 'Tajawal, sans-serif' // Add Arabic font if needed
                }
              }
            },
          },
          scales: {
            x: {
              stacked: true,
              ticks: {
                font: {
                  family: 'Tajawal, sans-serif'
                }
              }
            },
            y: {
              stacked: true,
              ticks: {
                font: {
                  family: 'Tajawal, sans-serif'
                }
              }
            }
          }
        }}
      />
    </div>
  );
}