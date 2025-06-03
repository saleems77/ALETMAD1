export default function TemplateCard({ template }) {
    // التحقق من وجود القالب وتوفير قيم افتراضية
    const safeTemplate = template || {
      preview: '',
      name: 'قالب بدون اسم',
      description: 'لا يوجد وصف متاح'
    };
  
    return (
      <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer">
        <div className="h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
          {/* التحقق من وجود صورة المعاينة */}
          {safeTemplate.preview && (
            <img 
              src={safeTemplate.preview} 
              alt={safeTemplate.name || 'قالب بدون اسم'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'; // إخفاء الصورة في حالة الخطأ
              }}
            />
          )}
        </div>
        
        <h3 className="font-semibold mb-2">
          {safeTemplate.name || 'قالب بدون اسم'}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {safeTemplate.description || 'لا يوجد وصف'}
        </p>
      </div>
    );
  }