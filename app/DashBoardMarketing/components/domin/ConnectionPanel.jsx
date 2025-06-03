'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntegratedStore } from './store'
import { 
  Button, 
  Card, 
  Input, 
  Spinner, 
  Divider, 
  Link,
  Tabs, 
  Tab
} from '@nextui-org/react'
import { 
  Link2, 
  Server, 
  Terminal, 
  CheckCircle, 
  AlertCircle,
  Copy
} from 'lucide-react'

const ConnectionMethods = {
  API: 'api',
  DNS: 'dns',
  MANUAL: 'manual'
}

export default function ConnectionPanel() {
  const { connection, updateConnection } = useIntegratedStore()
  const [activeMethod, setActiveMethod] = useState(ConnectionMethods.API)
  const [isVerifying, setIsVerifying] = useState(false)
  const { register, handleSubmit, formState } = useForm()

  const verifyConnection = async () => {
    setIsVerifying(true)
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsVerifying(false)
    return Math.random() > 0.5
  }

  const onSubmit = async data => {
    const isValid = await verifyConnection()
    if (isValid) {
      updateConnection({ 
        ...data, 
        status: 'connected',
        lastVerified: new Date().toISOString()
      })
    }
  }

  return (
    <div className="space-y-6">
      <Tabs
        selectedKey={activeMethod}
        onSelectionChange={setActiveMethod}
        variant="underlined"
      >
        <Tab 
          key={ConnectionMethods.API} 
          title={
            <div className="flex items-center gap-2">
              <Terminal size={16} />
              اتصال API
            </div>
          }
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Endpoint URL"
              variant="bordered"
              {...register('endpoint', { required: true })}
              defaultValue={connection.endpoint}
              endContent={
                <Button isIconOnly variant="light">
                  <Copy size={16} />
                </Button>
              }
            />
            
            <Input
              label="API Key"
              type="password"
              variant="bordered"
              {...register('apiKey', { required: true })}
              defaultValue={connection.apiKey}
            />
            
            <div className="flex gap-4 justify-end">
              <Button 
                type="submit" 
                color="primary"
                isLoading={formState.isSubmitting}
              >
                {formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </Button>
              <Button 
                variant="flat" 
                onClick={verifyConnection}
                isLoading={isVerifying}
              >
                التحقق من الاتصال
              </Button>
            </div>
          </form>
        </Tab>

        <Tab 
          key={ConnectionMethods.DNS} 
          title={
            <div className="flex items-center gap-2">
              <Server size={16} />
              إعدادات DNS
            </div>
          }
        >
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <AlertCircle size={18} />
                إرشادات الإعداد
              </h4>
              <p className="text-sm">
                قم بإضافة السجلات التالية إلى إعدادات DNS الخاصة بك:
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-4 bg-white p-3 rounded">
                  <span className="font-mono">CNAME</span>
                  <Divider orientation="vertical" className="h-6" />
                  <span className="flex-1">verify.yourdomain.com</span>
                  <Button size="sm" variant="flat">
                    نسخ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>

      {/* Connection Status */}
      {connection.status !== 'disconnected' && (
        <Card className="p-4 bg-green-50 border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" />
            <div>
              <p className="font-medium">الاتصال نشط</p>
              {connection.lastVerified && (
                <p className="text-sm text-green-700">
                  آخر تحقق: {new Date(connection.lastVerified).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}