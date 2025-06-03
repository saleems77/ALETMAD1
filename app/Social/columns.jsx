import { useState } from 'react';
import { 
  ColumnDef,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';

// نظام الألوان المحدد
const COLORS = {
  blue: '#008DCB',
  black: '#0D1012',
  gray: '#999999',
  red: '#E2101E',
  white: '#FFFFFF',
  yellow: '#F9D011'
};

// أيقونات الحالات
const STATUS_STYLES = {
  unread: { bg: COLORS.red, text: COLORS.white, icon: '🔴' },
  read: { bg: COLORS.blue, text: COLORS.white, icon: '🟢' },
  scheduled: { bg: COLORS.yellow, text: COLORS.black, icon: '⏰' },
  draft: { bg: COLORS.gray, text: COLORS.white, icon: '📝' }
};

const SOURCE_ICONS = {
  email: '📧',
  sms: '💬',
  whatsapp: '📱',
  facebook: '🗨️',
  instagram: '📸',
  default: '❓'
};

export const columns = [
  {
    accessorKey: 'source',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        style={{ 
          backgroundColor: COLORS.white,
          color: COLORS.black
        }}
        className="hover:bg-gray-100 transition-all"
      >
        المصدر
        <ArrowUpDown className="h-4 w-4 mr-2" style={{ color: COLORS.blue }} />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3" style={{ color: COLORS.black }}>
        <span className="text-xl">
          {SOURCE_ICONS[row.original.source] || SOURCE_ICONS.default}
        </span>
        <span className="font-medium">
          {row.original.source === 'whatsapp' ? 'واتساب' : 
          row.original.source === 'sms' ? 'رسالة نصية' : 
          row.original.source}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'content',
    header: () => <span style={{ color: COLORS.black }}>المحتوى</span>,
    cell: ({ row }) => (
      <div 
        className="max-w-[300px] truncate hover:whitespace-normal transition-all"
        style={{ color: COLORS.gray }}
      >
        {row.original.content}
      </div>
    ),
  },
  {
    accessorKey: 'timestamp',
    header: () => <span style={{ color: COLORS.black }}>الوقت والتاريخ</span>,
    cell: ({ row }) => (
      <div style={{ color: COLORS.gray }}>
        {new Date(row.original.timestamp).toLocaleDateString('ar-SA', {
          weekday: 'short',
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
      const style = STATUS_STYLES[status] || STATUS_STYLES.draft;
      
      return (
        <div 
          className="px-3 py-1 rounded-full inline-flex items-center gap-2 transition-all"
          style={{ 
            backgroundColor: style.bg,
            color: style.text
          }}
        >
          <span>{style.icon}</span>
          <span className="text-sm font-medium">
            {status === 'unread' ? 'غير مقروء' :
            status === 'read' ? 'مقروء' :
            status === 'scheduled' ? 'مجدول' : 'مسودة'}
          </span>
        </div>
      );
    },
  },
];

export function DataTable({ data }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <div 
      className="w-full p-6 rounded-lg shadow-xl"
      style={{ 
        backgroundColor: COLORS.white,
        border: `1px solid ${COLORS.gray}`
      }}
    >
      {/* شريط التحكم */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: COLORS.gray }}
          />
          <Input
            placeholder="ابحث في المحتوى..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 border-2 focus:border-blue-500"
            style={{ 
              backgroundColor: COLORS.white,
              borderColor: COLORS.gray
            }}
          />
        </div>
        
        <Button
          className="gap-2 ml-auto"
          style={{
            backgroundColor: COLORS.blue,
            color: COLORS.white
          }}
        >
          <Download className="h-4 w-4" />
          تصدير البيانات
        </Button>
      </div>

      {/* الجدول */}
      <div className="rounded-lg overflow-x-auto border-2" style={{ borderColor: COLORS.gray }}>
        <table className="w-full">
          <thead 
            className="border-b-2"
            style={{ borderColor: COLORS.gray, backgroundColor: COLORS.white }}
          >
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-right"
                    style={{
                      backgroundColor: COLORS.white,
                      color: COLORS.black
                    }}
                  >
                    {header.column.columnDef.header}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y-2" style={{ borderColor: COLORS.gray }}>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: COLORS.white }}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm whitespace-nowrap"
                    style={{ color: COLORS.black }}
                  >
                    {cell.column.columnDef.cell(cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* التصفح بين الصفحات */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <div className="flex items-center gap-2">
          <span style={{ color: COLORS.gray }}>
            عرض {table.getState().pagination.pageSize} من أصل {data.length} عنصر
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{
              borderColor: COLORS.blue,
              color: COLORS.blue
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span style={{ color: COLORS.black }}>
            الصفحة {table.getState().pagination.pageIndex + 1} من {table.getPageCount()}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{
              borderColor: COLORS.blue,
              color: COLORS.blue
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}