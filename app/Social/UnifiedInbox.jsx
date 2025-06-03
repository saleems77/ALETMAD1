"use client";
import { useState, useEffect, useMemo } from 'react';
import { DataTable } from './DataTable';
import { columns } from './columns';
import { getMessages } from './mocks/messages';
import { Button } from '@/components/ui/Buttonn';
import { 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Search, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// نظام الألوان المحدد مع نسب الاستخدام
const COLORS = {
  blue: '#008DCB',    // 10%
  black: '#0D1012',   // 5%
  gray: '#999999',    // 20%
  red: '#E2101E',     // 7%
  white: '#FFFFFF',   // 50%
  yellow: '#F9D011'   // 8%
};

const getStatusColor = (status) => {
  switch(status) {
    case 'read': return COLORS.blue;
    case 'unread': return COLORS.red;
    case 'pending': return COLORS.yellow;
    default: return COLORS.gray;
  }
};

export default function UnifiedInbox() {
  const [messages, setMessages] = useState([]);
  const [filters, setFilters] = useState({ type: 'all', status: 'all' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const mockMessages = await getMessages();
        setMessages(mockMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => (
      (filters.type === 'all' || msg.source === filters.type) &&
      (filters.status === 'all' || msg.status === filters.status) &&
      (searchTerm === '' || msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
    ));
  }, [messages, filters, searchTerm]);

  const stats = useMemo(() => ({
    total: messages.length,
    read: messages.filter(m => m.status === 'read').length,
    unread: messages.filter(m => m.status === 'unread').length,
    pending: messages.filter(m => m.status === 'pending').length
  }), [messages]);

  return (
    <div className="p-6 rounded-2xl shadow-xl" style={{ 
      backgroundColor: COLORS.white,
      border: `1px solid ${COLORS.gray}`
    }}>
      {/* شريط الإحصائيات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Mail, label: 'الإجمالي', value: stats.total, color: COLORS.blue },
          { icon: CheckCircle, label: 'المقروءة', value: stats.read, color: COLORS.blue },
          { icon: AlertCircle, label: 'غير المقروءة', value: stats.unread, color: COLORS.red },
          { icon: Loader2, label: 'المعلقة', value: stats.pending, color: COLORS.yellow }
        ].map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl shadow-sm transition-all hover:shadow-md"
            style={{ backgroundColor: COLORS.white }}
          >
            <div className="flex items-center gap-3">
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              <div>
                <div className="text-sm" style={{ color: COLORS.gray }}>{stat.label}</div>
                <div className="text-2xl font-bold" style={{ color: COLORS.black }}>
                  {stat.value}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* شريط التحكم */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="flex items-center gap-2 p-3 rounded-lg border transition-all focus-within:ring-2"
            style={{ 
              borderColor: COLORS.gray,
              backgroundColor: COLORS.white,
              ringColor: COLORS.blue
            }}
          >
            <Search className="ml-2" style={{ color: COLORS.gray }} />
            <input
              type="text"
              placeholder="ابحث في الرسائل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full focus:outline-none bg-transparent"
              style={{ color: COLORS.black }}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', 'read', 'unread', 'pending'].map((status) => (
            <Button
              key={status}
              onClick={() => setFilters(prev => ({ ...prev, status }))}
              style={{
                backgroundColor: filters.status === status ? getStatusColor(status) : COLORS.white,
                color: filters.status === status ? COLORS.white : COLORS.black,
                border: `1px solid ${COLORS.gray}`
              }}
              className="gap-2 transition-all"
            >
              {status === 'read' && <CheckCircle className="w-4 h-4" />}
              {status === 'unread' && <AlertCircle className="w-4 h-4" />}
              {{
                all: 'الكل',
                read: 'مقروءة',
                unread: 'غير مقروءة',
                pending: 'معلقة'
              }[status]}
            </Button>
          ))}
        </div>
      </div>

      {/* فلتر النوع */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'email', 'sms', 'whatsapp'].map(type => (
          <Button
            key={type}
            onClick={() => setFilters(prev => ({ ...prev, type }))}
            style={{
              backgroundColor: filters.type === type ? COLORS.blue : COLORS.white,
              color: filters.type === type ? COLORS.white : COLORS.black,
              border: `1px solid ${COLORS.gray}`
            }}
            className="gap-2 transition-all"
          >
            {type === 'email' && <Mail className="w-4 h-4" />}
            {type === 'sms' && <MessageSquare className="w-4 h-4" />}
            {type === 'whatsapp' && <Smartphone className="w-4 h-4" />}
            {{
              all: 'الكل',
              email: 'البريد',
              sms: 'SMS',
              whatsapp: 'واتساب'
            }[type]}
          </Button>
        ))}
      </div>

      {/* محتوى الجدول */}
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="h-14 rounded-lg animate-pulse"
                style={{ backgroundColor: COLORS.gray + '20' }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DataTable 
              columns={columns} 
              data={filteredMessages}
              style={{
                borderColor: COLORS.gray,
                backgroundColor: COLORS.white
              }}
            />
            
            {/* ملخص النتائج */}
            <div className="mt-4 text-sm flex justify-between items-center px-2">
              <div style={{ color: COLORS.gray }}>
                عرض {filteredMessages.length} من {messages.length} نتيجة
              </div>
              <div className="flex gap-4">
                {Object.entries(stats).map(([key, value]) => (
                  key !== 'total' && (
                    <div key={key} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: getStatusColor(key) }} />
                      <span style={{ color: COLORS.black }}>{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}