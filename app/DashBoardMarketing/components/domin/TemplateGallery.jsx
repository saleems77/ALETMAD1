'use client'
import { useState } from 'react'
import { useIntegratedStore } from './store'
import { 
  Card, 
  Input, 
  Button, 
  Select, 
  SelectItem,
  Image,
  Badge
} from '@nextui-org/react'
import { Search, Grid, List, Star, Eye } from 'lucide-react'

export default function TemplateGallery() {
  const { templates, currentDomain, linkTemplate } = useIntegratedStore()
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // تأكد من أن templates موجود وليس undefined
  const availableTemplates = templates || []

  const filteredTemplates = availableTemplates.filter(t => {
    const matchesSearch = t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: 'all', label: 'جميع الفئات' },
    { id: 'ecommerce', label: 'متاجر إلكترونية' },
    { id: 'portfolio', label: 'معارض أعمال' },
    { id: 'blog', label: 'مدونات' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <Input
          placeholder="ابحث عن قالب..."
          startContent={<Search className="text-gray-400" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        
        <div className="flex gap-2">
          <Select
            label="الفئة"
            className="min-w-[150px]"
            selectedKeys={[selectedCategory]}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </Select>
          
          <Button
            isIconOnly
            variant={viewMode === 'grid' ? 'solid' : 'light'}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={18} />
          </Button>
          <Button
            isIconOnly
            variant={viewMode === 'list' ? 'solid' : 'light'}
            onClick={() => setViewMode('list')}
          >
            <List size={18} />
          </Button>
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <Card className="p-8 text-center bg-gray-50">
          <p className="text-gray-500">لا توجد قوالب متاحة</p>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 
          'flex flex-col gap-4'}>
          {filteredTemplates.map(template => (
            <Card key={template.id} className="group relative h-full hover:shadow-lg transition-shadow">
              <Image
                src={template.thumbnail || '/default-template.jpg'}
                alt={template.name}
                className="h-48 object-cover"
                removeWrapper
              />
              
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{template.name}</h4>
                  {template.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{template.rating}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {template.description}
                </p>
                
                <div className="flex gap-2">
                  <Button
                    fullWidth
                    color="primary"
                    onClick={() => linkTemplate(template.id)}
                    isDisabled={!currentDomain}
                  >
                    اختيار القالب
                  </Button>
                  <Button 
                    variant="flat" 
                    startContent={<Eye className="w-4 h-4" />}
                  >
                    معاينة
                  </Button>
                </div>
              </div>
              
              {template.isPremium && (
                <Badge color="secondary" className="absolute top-2 right-2">
                  PRO
                </Badge>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}