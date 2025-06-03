'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ComplianceChart({ data }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        rtl: true
      },
      title: {
        display: true,
        text: 'مؤشرات الالتزام الشهرية'
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'مستوى الالتزام',
        data: data?.values || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4
      }
    ]
  };

  return <Line options={options} data={chartData} />;
}