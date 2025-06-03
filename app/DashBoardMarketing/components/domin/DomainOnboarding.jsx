'use client'
import { useIntegratedStore } from './store'
import { motion } from 'framer-motion'
import { CheckCircle, Globe, Layout, Link, Settings } from 'react-feather'
const steps = [
  { id: 1, icon: Globe, title: 'إضافة النطاق', status: 'active' },
  { id: 2, icon: Layout, title: 'اختيار القالب', status: 'pending' },
  { id: 3, icon: Link, title: 'إعدادات الربط', status: 'pending' }, 
  { id: 4, icon: Settings, title: 'التخصيص', status: 'pending' }
]

export default function DomainOnboarding() {
  const { currentDomain } = useIntegratedStore()
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 overflow-x-auto pb-4">
        {steps.map((step, index) => (
          <motion.div 
            key={step.id}
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={`flex flex-col items-center ${
              currentDomain?.step >= step.id ? 'text-primary' : 'text-gray-400'
            }`}>
              <step.icon 
                size={24} 
                className={`mb-2 ${
                  currentDomain?.step >= step.id 
                    ? 'text-primary' 
                    : 'text-gray-300'
                }`}
              />
              <span className="text-sm font-medium">{step.title}</span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="h-0.5 w-16 bg-gray-200 mx-4" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}