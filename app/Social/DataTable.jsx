"use client"
import { useState } from 'react';
import { 
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState // التصحيح هنا
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Search, AlertCircle, ChevronLeft, ChevronRight, Download } from 'lucide-react';
// نظام الألوان المحدد
const COLORS = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

// أنماط الحالات
const statusStyles = {
  unread: { bg: COLORS.red, text: COLORS.white, icon: <AlertCircle className="w-4 h-4 mr-1" /> },
  read: { bg: COLORS.blue, text: COLORS.white, icon: <CheckCircle className="w-4 h-4 mr-1" /> },
  pending: { bg: COLORS.yellow, text: COLORS.black, icon: <Clock className="w-4 h-4 mr-1" /> },
  failed: { bg: COLORS.gray, text: COLORS.white, icon: <XCircle className="w-4 h-4 mr-1" /> }
};

// أيقونات المصادر
const sourceIcons = {
  email: '📧',
  sms: '💬',
  whatsapp: '📱',
  default: '❓'
};

export const columns = [
  {
    accessorKey: 'source',
    header: ({ column }) => (
      <button 
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center hover:bg-gray-100 px-4 py-2 rounded-lg transition-all"
        style={{ color: COLORS.black }}
      >
        المصدر
        <ChevronLeft className="w-4 h-4 mr-2 transform rotate-90" style={{ color: COLORS.blue }} />
      </button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center font-medium" style={{ color: COLORS.blue }}>
        <span className="mr-2 text-lg">
          {sourceIcons[row.original.source] || sourceIcons.default}
        </span>
        {row.original.source === 'whatsapp' ? 'واتساب' : 
         row.original.source === 'sms' ? 'رسالة نصية' : 
         row.original.source}
      </div>
    ),
  },
  {
    accessorKey: 'content',
    header: () => <span style={{ color: COLORS.black }}>المحتوى</span>,
    cell: ({ row }) => (
      <div 
        className="max-w-[300px] truncate hover:max-w-none hover:whitespace-normal transition-all"
        style={{ color: COLORS.gray }}
      >
        {row.original.content}
      </div>
    )
  },
  {
    accessorKey: 'timestamp',
    header: () => <span style={{ color: COLORS.black }}>التاريخ</span>,
    cell: ({ row }) => (
      <div className="text-sm" style={{ color: COLORS.gray }}>
        {new Date(row.original.timestamp).toLocaleDateString('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: () => <span style={{ color: COLORS.black }}>الحالة</span>,
    cell: ({ row }) => {
      const status = row.original.status;
      const style = statusStyles[status] || statusStyles.failed;
      
      return (
        <div 
          className="inline-flex items-center px-3 py-1 rounded-full transition-all"
          style={{ 
            backgroundColor: style.bg,
            color: style.text
          }}
        >
          {style.icon}
          <span className="text-sm">
            {status === 'unread' ? 'غير مقروء' : 
             status === 'read' ? 'مقروء' :
             status === 'pending' ? 'معلق' : 'فشل'}
          </span>
        </div>
      );
    },
  },
];

export function DataTable({ columns, data }) {
  const [sorting, setSorting] = useState([]); // إزالة النوع TypeScript
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { 
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8
      }
    }
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl shadow-xl overflow-hidden"
      style={{ 
        backgroundColor: COLORS.white,
        border: `1px solid ${COLORS.gray}`
      }}
    >
      {/* شريط التحكم */}
      <div className="flex flex-col md:flex-row gap-4 p-4 border-b" style={{ borderColor: COLORS.gray }}>
        <div className="relative flex-1">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2" 
            style={{ color: COLORS.gray }}
          />
          <input
            placeholder="ابحث..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none transition-all"
            style={{ 
              borderColor: COLORS.gray,
              backgroundColor: COLORS.white
            }}
          />
        </div>
        
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
          style={{
            backgroundColor: COLORS.blue,
            color: COLORS.white
          }}
        >
          <Download className="w-4 h-4" />
          تصدير
        </button>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b" style={{ borderColor: COLORS.gray }}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-right text-sm font-semibold"
                    style={{ 
                      backgroundColor: COLORS.white,
                      color: COLORS.black
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          
          <tbody className="divide-y" style={{ borderColor: COLORS.gray }}>
            {table.getRowModel().rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: COLORS.white }}
              >
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className="px-6 py-4 text-sm"
                    style={{ color: COLORS.black }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* حالة عدم وجود بيانات */}
      {data.length === 0 && (
        <div className="p-8 text-center" style={{ color: COLORS.gray }}>
          <Search className="mx-auto w-12 h-12 mb-4" />
          لا توجد بيانات متاحة
        </div>
      )}

      {/* التصفح بين الصفحات */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t" style={{ borderColor: COLORS.gray }}>
        <div className="mb-4 md:mb-0">
          <span className="text-sm" style={{ color: COLORS.gray }}>
            عرض {table.getState().pagination.pageSize} من {data.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg border transition-all"
            style={{
              borderColor: COLORS.blue,
              color: COLORS.blue,
              opacity: table.getCanPreviousPage() ? 1 : 0.5
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-sm" style={{ color: COLORS.black }}>
            الصفحة {table.getState().pagination.pageIndex + 1} من {table.getPageCount()}
          </span>
          
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg border transition-all"
            style={{
              borderColor: COLORS.blue,
              color: COLORS.blue,
              opacity: table.getCanNextPage() ? 1 : 0.5
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}