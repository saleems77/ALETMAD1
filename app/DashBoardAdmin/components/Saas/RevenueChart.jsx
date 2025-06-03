'use client';
import { useState } from 'react';
import { 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Tabs, Tab, Select, SelectItem } from '@nextui-org/react';
import { FiFilter, FiDollarSign, FiCalendar } from 'react-icons/fi';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-bold">{label}</p>
        {payload.map((entry, index) => (
          <p 
            key={index}
            className="flex items-center gap-2"
            style={{ color: entry.color }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data, type = 'area' }) {
  const [timeRange, setTimeRange] = useState('monthly');
  const [currency, setCurrency] = useState('USD');

  const filteredData = data[timeRange].map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('ar-EG', {
      month: 'short',
      year: 'numeric'
    })
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h4 className="text-lg font-bold flex items-center gap-2">
          <FiDollarSign className="text-green-500" />
          تحليل الإيرادات
        </h4>
        
        <div className="flex gap-2 items-center">
          <Select
            size="sm"
            startContent={<FiCalendar className="text-gray-500" />}
            value={timeRange}
            onChange={setTimeRange}
            className="min-w-[120px]"
          >
            <SelectItem key="daily" value="daily">يومي</SelectItem>
            <SelectItem key="weekly" value="weekly">أسبوعي</SelectItem>
            <SelectItem key="monthly" value="monthly">شهري</SelectItem>
            <SelectItem key="yearly" value="yearly">سنوي</SelectItem>
          </Select>

          <Select
            size="sm"
            startContent={<span className="text-sm">$</span>}
            value={currency}
            onChange={setCurrency}
            className="min-w-[100px]"
          >
            <SelectItem key="USD" value="USD">USD</SelectItem>
            <SelectItem key="SAR" value="SAR">SAR</SelectItem>
            <SelectItem key="EUR" value="EUR">EUR</SelectItem>
          </Select>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                fill="#6366f1"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          ) : type === 'bar' ? (
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: '#4f46e5' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <Tabs 
        aria-label="تفاصيل الإيرادات"
        size="sm"
        className="mt-6"
        classNames={{
          tabList: "gap-4",
          cursor: "bg-blue-500"
        }}
      >
        <Tab key="breakdown" title="التفاصيل">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <StatCard
              label="الإيرادات الإجمالية"
              value={data.totals.gross}
              delta="+12.5%"
              deltaType="positive"
            />
            <StatCard
              label="الضرائب"
              value={data.totals.tax}
              delta="-2.3%"
              deltaType="negative"
            />
            <StatCard
              label="صافي الربح"
              value={data.totals.net}
              delta="+8.4%"
              deltaType="positive"
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

const StatCard = ({ label, value, delta, deltaType }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-2xl font-bold mt-2">${value.toLocaleString()}</div>
    {delta && (
      <div className={`text-sm mt-1 ${
        deltaType === 'positive' ? 'text-green-600' : 'text-red-600'
      }`}>
        {delta} عن الفترة السابقة
      </div>
    )}
  </div>
);