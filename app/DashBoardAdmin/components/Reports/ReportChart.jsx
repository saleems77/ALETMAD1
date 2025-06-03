// ReportChart.jsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'تحليل التقارير' },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    y: { beginAtZero: true, ticks: { callback: (v) => `${v} ر.س` } }
  }
};

// استخدام تدرج لوني احترافي
const chartData = {
  labels: data.map(d => d.date),
  datasets: [{
    label: 'المبيعات',
    data: data.map(d => d.data.totalSales),
    backgroundColor: 'rgba(33, 150, 243, 0.6)',
    borderColor: '#2196F3',
    borderWidth: 2,
    borderRadius: 4
  }]
};