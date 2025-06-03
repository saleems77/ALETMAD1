'use client'
import { useState } from 'react'
import { 
  BarChart, 
  LineChart, 
  PieChart,
  Calendar,
  Globe 
} from 'lucide-react'
import { 
  Card, 
  Tabs, 
  Tab, 
  Select, 
  SelectItem 
} from '@nextui-org/react'
import { Bar, Line, Pie } from 'react-chartjs-2'
import 'chart.js/auto'

const timeRanges = [
  { label: '24 ساعة', value: '24h' },
  { label: '7 أيام', value: '7d' },
  { label: '30 يومًا', value: '30d' },
]

export default function DomainAnalytics() {
  const [selectedRange, setSelectedRange] = useState('7d')
  const [activeTab, setActiveTab] = useState('traffic')

  const sampleData = {
    traffic: {
      labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
      datasets: [{
        label: 'الزيارات',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.4
      }]
    },
    sources: {
      labels: ['مباشر', 'اجتماعي', 'بحث', 'إحالات'],
      datasets: [{
        data: [45, 30, 15, 10],
        backgroundColor: [
          'rgb(99, 102, 241)',
          'rgb(249, 115, 22)',
          'rgb(16, 185, 129)',
          'rgb(244, 63, 94)'
        ]
      }]
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Tabs 
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          variant="underlined"
        >
          <Tab key="traffic" title={
            <div className="flex items-center gap-2">
              <BarChart size={16} />
              حركة المرور
            </div>
          } />
          <Tab key="sources" title={
            <div className="flex items-center gap-2">
              <PieChart size={16} />
              مصادر الزيارات
            </div>
          } />
          <Tab key="geo" title={
            <div className="flex items-center gap-2">
              <Globe size={16} />
              التوزيع الجغرافي
            </div>
          } />
        </Tabs>
        
        <Select
          label="الفترة الزمنية"
          className="min-w-[120px]"
          selectedKeys={[selectedRange]}
          onChange={e => setSelectedRange(e.target.value)}
        >
          {timeRanges.map(r => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <h4 className="font-medium mb-4">إحصائيات الزيارات</h4>
          {activeTab === 'traffic' && (
            <Line data={sampleData.traffic} />
          )}
          {activeTab === 'sources' && (
            <Pie data={sampleData.sources} />
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-4">
            <h4 className="font-medium mb-4">الأداء الرئيسي</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold">1.2K</p>
                <p className="text-sm text-gray-600">الزيارات</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold">4.2%</p>
                <p className="text-sm text-gray-600">معدل التحويل</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold">2m 34s</p>
                <p className="text-sm text-gray-600">مدة المتوسط</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <p className="text-2xl font-bold">64%</p>
                <p className="text-sm text-gray-600">الزوار الجدد</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-4">الأحداث المهمة</h4>
            <div className="space-y-3">
              {['2024-03-15: إطلاق الحملة التسويقية', 
                '2024-03-10: تحديث النظام',
                '2024-03-05: إضافة نطاق جديد'].map(event => (
                <div key={event} className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm">{event}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}