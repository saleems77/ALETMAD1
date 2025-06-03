'use client'
import { useEffect , useState} from 'react'
import { useIntegratedStore } from './store'
import { Tabs, Tab, Card, Divider, Spinner, Button } from '@nextui-org/react'
import DomainOnboarding from './DomainOnboarding'
import DomainManager from './DomainManager'
import TemplateGallery from './TemplateGallery'
import ConnectionPanel from './ConnectionPanel'
import DomainAnalytics from './DomainAnalytics'
import { Globe, LayoutTemplate, Link2, BarChart, AlertCircle } from 'lucide-react'

export default function DomainDashboard() {
  const { currentDomain, connection, setCurrentDomain } = useIntegratedStore()
  const [isLoading, setIsLoading] = useState(false)

  // Simulate loading domains on mount
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentDomain({ id: 1, name: 'example.com', status: 'active' })
      setIsLoading(false)
    }, 1000)
  }, [])

  const tabs = [
    { 
      key: 'domains', 
      title: 'إدارة النطاقات',
      icon: <Globe size={18} />,
      content: <DomainManager />
    },
    {
      key: 'templates',
      title: 'معرض القوالب',
      icon: <LayoutTemplate size={18} />,
      disabled: !currentDomain,
      content: <TemplateGallery />
    },
    {
      key: 'connection',
      title: 'إعدادات الربط',
      icon: <Link2 size={18} />,
      disabled: !currentDomain,
      content: <ConnectionPanel />
    },
    {
      key: 'analytics',
      title: 'التحليلات',
      icon: <BarChart size={18} />,
      disabled: !currentDomain,
      content: <DomainAnalytics />
    }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <DomainOnboarding />

      {!currentDomain && (
        <Card className="p-6 bg-yellow-50 border border-yellow-200">
          <div className="flex items-center gap-4">
            <AlertCircle className="text-yellow-600" size={24} />
            <div>
              <h3 className="font-medium">يجب اختيار نطاق أولاً</h3>
              <p className="text-sm text-yellow-700">
                الرجاء إضافة نطاق جديد أو اختيار نطاق موجود للتمكن من الوصول إلى جميع الميزات
              </p>
            </div>
            <Button 
              color="warning" 
              variant="flat" 
              className="ml-auto"
              onClick={() => setCurrentDomain({ id: 1, name: 'example.com', status: 'active' })}
            >
              استخدام نطاق تجريبي
            </Button>
          </div>
        </Card>
      )}

      <Card className="shadow-xl rounded-2xl overflow-hidden">
        <Tabs 
          aria-label="Domain Controls"
          variant="underlined"
          selectedKey={currentDomain ? undefined : 'domains'}
          classNames={{
            tabList: "bg-gray-50 p-4 border-b",
            panel: "p-6 min-h-[500px]"
          }}
        >
          {tabs.map(tab => (
            <Tab 
              key={tab.key}
              title={
                <div className="flex items-center gap-2">
                  {tab.icon}
                  {tab.title}
                  {tab.disabled && (
                    <span className="text-xs text-gray-400">(مطلوب نطاق)</span>
                  )}
                </div>
              }
              disabled={tab.disabled}
            >
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Spinner size="lg" />
                </div>
              ) : (
                <>
                  {tab.key === 'analytics' && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <BarChart size={20} />
                        إحصائيات النطاق: {currentDomain?.name}
                      </h3>
                      <Divider className="my-4" />
                    </div>
                  )}
                  {tab.content}
                </>
              )}
            </Tab>
          ))}
        </Tabs>
      </Card>
    </div>
  )
}