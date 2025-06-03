"use client"
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Info, ChevronDown, AlertCircle, ArrowUpRight, Clock } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const AdPerformanceChart = ({ data }) => {
  // نظام الألوان المحدد
  const colors = {
    blue: '#008DCB',
    black: '#0D1012',
    gray: '#999999',
    red: '#E2101E',
    white: '#FFFFFF',
    yellow: '#F9D011'
  };

  // بيانات الرسم البياني مع تحسينات التصميم
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString('ar-SA')),
    datasets: [
      {
        label: 'الزيارات',
        data: data.map(d => d.views),
        borderColor: colors.blue,
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, `${colors.blue}20`);
          gradient.addColorStop(1, `${colors.blue}02`);
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: colors.blue
      },
      {
        label: 'التحويلات',
        data: data.map(d => d.conversions),
        borderColor: colors.yellow,
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, `${colors.yellow}20`);
          gradient.addColorStop(1, `${colors.yellow}02`);
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: colors.yellow
      }
    ]
  };

  // إعدادات الرسم البياني المحسنة
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        rtl: true,
        labels: {
          font: {
            family: 'Noto Sans Arabic',
            size: 14
          },
          color: colors.black,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        rtl: true,
        bodyFont: {
          family: 'Noto Sans Arabic',
          size: 14
        },
        titleFont: {
          family: 'Noto Sans Arabic',
          size: 16
        },
        backgroundColor: colors.white,
        titleColor: colors.black,
        bodyColor: colors.gray,
        borderColor: colors.gray,
        borderWidth: 1,
        padding: 16,
        boxShadow: '0px 4px 20px rgba(13, 16, 18, 0.1)'
      }
    },
    scales: {
      x: {
        grid: {
          color: `${colors.gray}20`
        },
        ticks: {
          font: {
            family: 'Noto Sans Arabic',
            size: 12
          },
          color: colors.gray
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: `${colors.gray}15`
        },
        ticks: {
          color: colors.gray,
          font: {
            family: 'Noto Sans Arabic',
            size: 12
          },
          callback: (value) => value.toLocaleString('ar-EG')
        }
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100" 
         style={{backgroundColor: colors.white}}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold" style={{color: colors.black}}>
            أداء الحملة
          </h3>
          <button className="p-2 hover:bg-gray-50 rounded-lg" 
                  style={{color: colors.gray}}>
            <Info size={20} />
          </button>
        </div>

        {/* Time Filters */}
        <div className="flex gap-2 mt-4 md:mt-0">
          {['يومي', 'أسبوعي', 'شهري'].map((label) => (
            <button
              key={label}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: label === 'أسبوعي' ? colors.blue : colors.white,
                color: label === 'أسبوعي' ? colors.white : colors.gray,
                border: `1px solid ${colors.gray}20`
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="إجمالي الزيارات" 
          value="245,800" 
          trend="+12.5%" 
          color={colors.blue}
          icon={<ArrowUpRight size={18} />}
        />
        <StatCard 
          title="معدل التحويل" 
          value="8.4%" 
          trend="+2.1%" 
          color={colors.yellow}
          icon={<ArrowUpRight size={18} />}
        />
        <StatCard 
          title="معدل الارتداد" 
          value="34.2%" 
          trend="-1.8%" 
          color={colors.red}
          icon={<AlertCircle size={18} />}
        />
        <StatCard 
          title="أخر تحديث" 
          value="منذ 2 ساعة" 
          color={colors.gray}
          icon={<Clock size={18} />}
        />
      </div>

      {/* Chart Container */}
      <div className="h-[500px] relative">
        <Line data={chartData} options={options} />
        
        {/* Chart Watermark */}
        <div className="absolute bottom-4 right-4 text-xs" 
             style={{color: `${colors.gray}30`}}>
          مُحدث تلقائياً كل ساعة
        </div>
      </div>
    </div>
  );
};

// مكون البطاقة الإحصائية المساعد
const StatCard = ({ title, value, trend, color, icon }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm mb-1" style={{color: '#999999'}}>{title}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{color: '#0D1012'}}>
              {value}
            </span>
            {trend && (
              <span className="text-sm flex items-center gap-1" 
                    style={{color: trend.startsWith('+') ? '#008DCB' : '#E2101E'}}>
                {icon}
                {trend}
              </span>
            )}
          </div>
        </div>
        <div className="p-2 rounded-lg" style={{backgroundColor: `${color}10`}}>
          {React.cloneElement(icon, { size: 20, color: color })}
        </div>
      </div>
    </div>
  );
};

export default AdPerformanceChart;