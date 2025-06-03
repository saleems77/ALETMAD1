'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntegratedStore } from './store'
import { 
  Card, 
  Input, 
  Button, 
  Spinner, 
  Badge,
  Divider,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
} from '@nextui-org/react'
import { Globe, Plus, Trash2, Check, X, AlertCircle } from 'lucide-react'

export default function DomainManager() {
  const { 
    domains, 
    currentDomain,
    addDomain, 
    deleteDomain,
    setCurrentDomain
  } = useIntegratedStore()
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState(null)
  const { register, handleSubmit, formState, reset } = useForm()

  const onSubmit = async (data) => {
    const newDomain = {
      name: data.domain,
      status: 'pending'
    }
    await addDomain(newDomain)
    setIsAdding(false)
    reset()
  }

  const handleSetDomain = (domain) => {
    setCurrentDomain(domain)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Globe size={20} />
          النطاقات المسجلة
        </h3>
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onClick={() => setIsAdding(true)}
        >
          إضافة نطاق
        </Button>
      </div>

      {/* Add Domain Modal */}
      <Modal isOpen={isAdding} onClose={() => setIsAdding(false)}>
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex items-center gap-2">
              <Globe size={20} />
              إضافة نطاق جديد
            </ModalHeader>
            <ModalBody>
              <Input
                {...register('domain', { 
                  required: 'حقل النطاق مطلوب',
                  pattern: {
                    value: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
                    message: 'صيغة النطاق غير صحيحة'
                  }
                })}
                label="اسم النطاق"
                placeholder="example.com"
                variant="bordered"
                autoFocus
                isInvalid={formState.errors.domain}
                errorMessage={formState.errors.domain?.message}
              />
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <AlertCircle size={16} className="text-blue-600" />
                <p className="text-sm text-blue-600">
                  تأكد من أن النطاق مسجل لديك قبل الإضافة
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button 
                variant="light" 
                onPress={() => setIsAdding(false)}
              >
                إلغاء
              </Button>
              <Button 
                color="primary" 
                type="submit"
                isLoading={formState.isSubmitting}
              >
                إضافة النطاق
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!isDeleting} onClose={() => setIsDeleting(null)}>
        <ModalContent>
          <ModalHeader>تأكيد الحذف</ModalHeader>
          <ModalBody>
            <p>هل أنت متأكد من حذف النطاق <strong>{isDeleting?.name}</strong>؟</p>
            <p className="text-sm text-danger">هذا الإجراء لا يمكن التراجع عنه</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsDeleting(null)}>
              إلغاء
            </Button>
            <Button 
              color="danger" 
              onPress={() => {
                deleteDomain(isDeleting.id)
                setIsDeleting(null)
              }}
            >
              تأكيد الحذف
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Domains List */}
      {domains.length === 0 ? (
        <Card className="p-8 text-center bg-gray-50">
          <p className="text-gray-500">لا توجد نطاقات مسجلة</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {domains.map(domain => (
            <Card 
              key={domain.id} 
              className={`p-4 transition-all ${currentDomain?.id === domain.id ? 'border-2 border-primary' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => handleSetDomain(domain)}
                >
                  <Globe className={currentDomain?.id === domain.id ? 'text-primary' : 'text-gray-500'} />
                  <div>
                    <h4 className="font-medium">{domain.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        color={
                          domain.status === 'active' ? 'success' :
                          domain.status === 'pending' ? 'warning' : 'danger'
                        }
                        variant="flat"
                        size="sm"
                      >
                        {domain.status === 'active' ? 'مفعل' :
                         domain.status === 'pending' ? 'قيد التحقق' : 'غير نشط'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(domain.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    size="sm"
                    onClick={() => setIsDeleting(domain)}
                  >
                    <Trash2 size={16} />
                  </Button>
                  {domain.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<Check size={16} />}
                    >
                      التحقق
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}