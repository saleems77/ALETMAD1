import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnifiedInbox from './UnifiedInbox';
import SocialScheduler from './SocialScheduler';

// نظام الألوان المحدد مع النسب
const COLORS = {
  blue: '#008DCB',    // 10%
  black: '#0D1012',   // 5%
  gray: '#999999',    // 20%
  red: '#E2101E',     // 7%
  white: '#FFFFFF',   // 50%
  yellow: '#F9D011'   // 8%
};

export default function SosialDashboard() {
  return (
    <div className="p-4 md:p-6 min-h-screen" style={{ backgroundColor: COLORS.white }}>
      <h1 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: COLORS.black }}>
        🚀 منظّم الوسائط الاجتماعية
      </h1>
      
      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="flex flex-wrap justify-center md:justify-start mb-6 gap-2">
          <TabsTrigger 
            value="inbox" 
            className="px-4 py-2 rounded-xl transition-all data-[state=active]:shadow-sm"
            style={{
              backgroundColor: COLORS.white,
              color: COLORS.black,
              border: `1px solid ${COLORS.gray}`,
              '&[data-state=active]': {
                backgroundColor: COLORS.blue,
                color: COLORS.white,
                borderColor: COLORS.blue
              }
            }}
          >
            📥 صندوق الوارد
          </TabsTrigger>
          <TabsTrigger 
            value="scheduler" 
            className="px-4 py-2 rounded-xl transition-all data-[state=active]:shadow-sm"
            style={{
              backgroundColor: COLORS.white,
              color: COLORS.black,
              border: `1px solid ${COLORS.gray}`,
              '&[data-state=active]': {
                backgroundColor: COLORS.blue,
                color: COLORS.white,
                borderColor: COLORS.blue
              }
            }}
          >
            🗓️ جدولة المنشورات
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inbox" className="mt-4">
          <div className="border rounded-2xl overflow-hidden shadow-sm" 
               style={{ borderColor: COLORS.gray }}>
            <UnifiedInbox />
          </div>
        </TabsContent>
        
        <TabsContent value="scheduler" className="mt-4">
          <div className="border rounded-2xl overflow-hidden shadow-sm" 
               style={{ borderColor: COLORS.gray }}>
            <SocialScheduler />
          </div>
        </TabsContent>
      </Tabs>

      {/* شريط الحالة السفلية */}
      <div className="mt-6 pt-4 border-t text-sm text-center" 
           style={{ borderColor: COLORS.gray, color: COLORS.gray }}>
        <div className="flex flex-wrap justify-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.blue }} />
            نشط الآن
          </span>
          <span>الإصدار 2.1.0</span>
          <span>© 2024 جميع الحقوق محفوظة</span>
        </div>
      </div>
    </div>
  );
}