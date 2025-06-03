"use client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TemplateGallery from './TemplateGallery';
import EmailEditor from './EmailEditor';
import { useTemplates } from './useTemplates';

export default function EmailTemplatesPage() {
  const { templates, saveTemplate } = useTemplates();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">إدارة القوالب البريدية</h1>
      
      <Tabs defaultValue="gallery">
        <TabsList className="mb-6">
          <TabsTrigger value="gallery">معرض القوالب</TabsTrigger>
          <TabsTrigger value="new">إنشاء قالب جديد</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery">
          <TemplateGallery templates={templates} />
        </TabsContent>

        <TabsContent value="new">
          <EmailEditor 
            onSave={(content) => saveTemplate({
              id: `et${templates.length + 1}`,
              name: `قالب جديد ${templates.length + 1}`,
              content,
              type: 'email',
              created: new Date().toISOString()
            })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}