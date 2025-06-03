'use client';
import { useEffect, useState } from 'react';
import { 
  ClockIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const theme = {
  blue: '#008DCB',    
  black: '#0D1012',   
  gray: '#999999',    
  red: '#E2101E',     
  white: '#FFFFFF',   
  yellow: '#F9D011'   
};

const actionIcons = {
  edit: <PencilIcon className="w-5 h-5" />,
  delete: <TrashIcon className="w-5 h-5" />,
  login: <ArrowRightOnRectangleIcon className="w-5 h-5" />,
  logout: <ArrowLeftOnRectangleIcon className="w-5 h-5" />,
  default: <ClockIcon className="w-5 h-5" />
};

const logVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -50 }
};

export default function ActivityLogs({ activityLogs = [], isLoading }) {
  const [groupedLogs, setGroupedLogs] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const safeLogs = Array.isArray(activityLogs) ? activityLogs : [];
    
    const filtered = safeLogs.filter(log => {
      const matchesFilter = activeFilter === 'all' || log.actionType === activeFilter;
      const searchText = searchQuery.toLowerCase();
      const details = (log.details || '').toLowerCase();
      const target = (log.target || '').toLowerCase();
      return matchesFilter && (details.includes(searchText) || target.includes(searchText));
    });

    const grouped = filtered.reduce((acc, log) => {
      try {
        const date = new Date(log.timestamp).toLocaleDateString('ar-EG');
        if (!acc[date]) acc[date] = [];
        acc[date].push(log);
      } catch (error) {
        console.error('Error processing log entry:', error);
      }
      return acc;
    }, {});

    setGroupedLogs(grouped);
  }, [activityLogs, activeFilter, searchQuery]);

  const getActionLabel = (actionType) => {
    const labels = {
      edit: 'تعديل بيانات',
      delete: 'حذف عنصر',
      login: 'دخول إلى النظام',
      logout: 'خروج من النظام',
      create: 'إنشاء عنصر جديد',
      update: 'تحديث الإعدادات'
    };
    return labels[actionType] || 'إجراء غير معروف';
  };

  const getActionColor = (actionType) => {
    const colors = {
      edit: theme.yellow,
      delete: theme.red,
      login: theme.blue,
      logout: theme.black,
      default: theme.gray
    };
    return colors[actionType] || colors.default;
  };

  if (isLoading) return (
    <div className="animate-pulse space-y-6 p-6 max-w-4xl mx-auto">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-5 rounded-xl shadow-sm" style={{ backgroundColor: theme.white }}>
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[...Array(2)].map((_, j) => (
            <div key={j} className="flex gap-4 p-4 mb-4">
              <div className="h-7 w-7 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  if (!activityLogs?.length) return (
    <div className="text-center py-12 max-w-4xl mx-auto" style={{ color: theme.black }}>
      <div className="mx-auto h-24 w-24 mb-4" style={{ color: theme.gray }}>
        <ClockIcon className="w-full h-full" />
      </div>
      <h3 className="text-lg font-medium" style={{ color: theme.black }}>
        لا توجد نشاطات مسجلة
      </h3>
      <p className="mt-1 text-sm" style={{ color: theme.gray }}>
        سيظهر هنا أي نشاط يتم تنفيذه على النظام
      </p>
    </div>
  );

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: theme.black }}>
          <ClockIcon className="w-7 h-7" style={{ color: theme.blue }} />
          سجل النشاطات
        </h2>
        
        <input
          type="text"
          placeholder="ابحث في النشاطات..."
          className="px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: theme.white,
            border: `1px solid ${theme.gray}`,
            color: theme.black,
            width: '300px',
            focusRing: `0 0 0 3px ${theme.blue}33`
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-3 flex-wrap" style={{ borderBottom: `2px solid ${theme.gray}`, paddingBottom: '1rem' }}>
        {['all', 'edit', 'delete', 'login', 'logout'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{
              backgroundColor: activeFilter === filter ? theme.blue : theme.white,
              color: activeFilter === filter ? theme.white : theme.black,
              border: `1px solid ${activeFilter === filter ? theme.blue : theme.gray}`,
              boxShadow: activeFilter === filter ? `0 2px 4px ${theme.blue}33` : 'none'
            }}
          >
            {getActionLabel(filter)}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {Object.keys(groupedLogs).length > 0 ? (
          Object.entries(groupedLogs).map(([date, logs]) => (
            <div 
              key={date} 
              className="rounded-xl shadow-sm overflow-hidden"
              style={{
                backgroundColor: theme.white,
                border: `1px solid ${theme.gray}`
              }}
            >
              <div 
                className="flex items-center gap-3 px-5 py-3"
                style={{
                  backgroundColor: theme.blue + '15',
                  borderBottom: `1px solid ${theme.gray}`
                }}
              >
                <CalendarIcon className="w-5 h-5" style={{ color: theme.blue }} />
                <span className="font-semibold" style={{ color: theme.black }}>{date}</span>
              </div>

              <div className="p-5 space-y-4">
                <AnimatePresence>
                  {logs.map((log) => {
                    const time = new Date(log.timestamp).toLocaleTimeString('ar-EG', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <motion.div
                        key={log.id}
                        variants={logVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        layout
                        className="flex items-start gap-4 p-4 rounded-lg transition-all hover:shadow-sm cursor-pointer"
                        style={{
                          backgroundColor: theme.white,
                          border: `1px solid ${theme.gray}`,
                          hoverBorder: `1px solid ${theme.blue}`
                        }}
                      >
                        <div 
                          className="p-2 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: getActionColor(log.actionType) + '20',
                            color: getActionColor(log.actionType)
                          }}
                        >
                          {actionIcons[log.actionType] || actionIcons.default}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span 
                                className="font-medium text-sm"
                                style={{ color: theme.black }}
                              >
                                {getActionLabel(log.actionType)}
                              </span>
                              {log.user && (
                                <span 
                                  className="px-2 py-1 text-xs rounded-full"
                                  style={{
                                    backgroundColor: theme.yellow + '20',
                                    color: theme.black
                                  }}
                                >
                                  {log.user}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span 
                                className="text-xs"
                                style={{ color: theme.gray }}
                              >
                                {time}
                              </span>
                            </div>
                          </div>

                          {log.details && (
                            <p 
                              className="text-xs mt-2"
                              style={{ color: theme.black }}
                            >
                              التفاصيل: <span style={{ color: theme.gray }}>{log.details}</span>
                            </p>
                          )}

                          {log.target && (
                            <div 
                              className="text-xs mt-2 flex items-center gap-1"
                              style={{ color: theme.gray }}
                            >
                              على: 
                              <span 
                                className="font-medium px-2 py-1 rounded"
                                style={{
                                  backgroundColor: theme.red + '10',
                                  color: theme.red
                                }}
                              >
                                {log.target}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 rounded-lg" style={{ backgroundColor: theme.white }}>
            <p className="text-gray-500">لا توجد نتائج مطابقة للبحث</p>
          </div>
        )}
      </div>
    </div>
  );
}
