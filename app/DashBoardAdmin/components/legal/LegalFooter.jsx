export default function LegalFooter() {
    return (
      <footer className="bg-gray-50 mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* معلومات الاتصال */}
            <div>
              <h3 className="text-lg font-semibold mb-4">الاتصال</h3>
              <p className="text-gray-600">الرياض، المملكة العربية السعودية</p>
              <p className="text-gray-600 mt-2">info@arabplatform.com</p>
              <p className="text-gray-600">+966 112345678</p>
            </div>
            
            {/* روابط سريعة */}
            <div>
              <h3 className="text-lg font-semibold mb-4">روابط مهمة</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-600 hover:text-blue-600">عن المنصة</a></li>
                <li><a href="/faq" className="text-gray-600 hover:text-blue-600">الأسئلة الشائعة</a></li>
                <li><a href="/blog" className="text-gray-600 hover:text-blue-600">المدونة</a></li>
              </ul>
            </div>
            
            {/* شهادة التوافق */}
            <div>
              <div className="bg-white p-4 rounded-lg shadow">
                <img 
                  src="/compliance-badge.svg" 
                  alt="شهادة التوافق" 
                  className="h-16 mx-auto"
                />
                <p className="text-center text-sm mt-2 text-gray-600">
                  متوافق مع أنظمة حماية البيانات الدولية
                </p>
              </div>
            </div>
          </div>
          
          {/* حقوق النشر */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              © {new Date().getFullYear()} منصة التعلم العربية. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    );
  }