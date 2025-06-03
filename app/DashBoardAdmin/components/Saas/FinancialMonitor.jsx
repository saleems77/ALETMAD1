'use client';
import { 
  Card, 
  Tabs, 
  Tab, 
  Select, 
  SelectItem, 
  Tooltip,
  Progress,
  Button
} from "@nextui-org/react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip,
  ResponsiveContainer 
} from "recharts";
import { 
  FiDollarSign, 
  FiFilter, 
  FiDownload, 
  FiAlertCircle,
  FiTrendingUp,
  FiBarChart2
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { exportToExcel } from "./exportUtils";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <p className="font-bold mb-2">{payload[0].payload.month}</p>
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full"/>
          <span>الإيرادات: ${payload[0].value.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function FinancialMonitor() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(false);
  
  // بيانات ديناميكية (يمكن استبدالها بطلبات API)
  const revenueData = {
    monthly: [
      { month: "يناير", revenue: 12000 },
      { month: "فبراير", revenue: 15000 },
      { month: "مارس", revenue: 18000 },
    ],
    yearly: [
      { month: "2023 Q1", revenue: 45000 },
      { month: "2023 Q2", revenue: 52000 },
    ]
  };

  const stats = {
    total: 97000,
    average: 8075,
    growth: 12.5
  };

  const handleExport = () => {
    setIsLoading(true);
    setTimeout(() => {
      exportToExcel(revenueData[timeRange], 'financial-report');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-6 shadow-xl rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <FiDollarSign className="w-8 h-8 text-blue-500"/>
            <h2 className="text-2xl font-bold">لوحة التحكم المالية</h2>
          </div>
          
          <div className="flex gap-2 items-center">
            <Select
              size="sm"
              label="الفترة"
              className="min-w-[120px]"
              selectedKeys={[timeRange]}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <SelectItem key="monthly" value="monthly">شهري</SelectItem>
              <SelectItem key="yearly" value="yearly">سنوي</SelectItem>
            </Select>
            
            <Button
              color="primary"
              startContent={<FiDownload/>}
              onClick={handleExport}
              isLoading={isLoading}
            >
              تصدير
            </Button>
          </div>
        </div>

        <Tabs variant="underlined" className="mb-8">
          <Tab 
            key="overview" 
            title={
              <div className="flex items-center gap-2">
                <FiBarChart2/>
                نظرة عامة
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-gray-600 mb-2">الإيرادات الإجمالية</div>
                <div className="text-2xl font-bold text-blue-600">
                  ${stats.total.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-gray-600 mb-2">المتوسط الشهري</div>
                <div className="text-2xl font-bold text-green-600">
                  ${stats.average.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="text-gray-600 mb-2">معدل النمو</div>
                <div className="text-2xl font-bold text-purple-600">
                  +{stats.growth}%
                </div>
              </div>
            </div>

            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData[timeRange]}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    tick={{ fill: '#6b7280' }}
                  />
                  <ChartTooltip content={<CustomTooltip/>}/>
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fill="#93c5fd"
                    strokeWidth={2}
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Tab>

          <Tab 
            key="trends" 
            title={
              <div className="flex items-center gap-2">
                <FiTrendingUp/>
                التحليلات
              </div>
            }
          >
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-4">توزيع الإيرادات</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>الخدمات الأساسية</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} color="primary"/>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>الخدمات المميزة</span>
                        <span>30%</span>
                      </div>
                      <Progress value={30} color="secondary"/>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-4">المقارنة السنوية</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span>2023</span>
                      <span className="text-green-500">+12.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>2022</span>
                      <span className="text-red-500">-3.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>

        <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4">
          <FiAlertCircle className="text-blue-600 w-8 h-8 flex-shrink-0"/>
          <div>
            <h4 className="font-bold text-blue-600">ملاحظة مهمة</h4>
            <p className="text-blue-500">تشمل البيانات جميع الفروع والخدمات النشطة</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}