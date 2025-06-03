'use client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FileText, CircleCheck, CircleX } from 'lucide-react';

const PayoutHistory = () => {
  // البيانات الوهمية
  const data = [
    { date: '2025-04-01', amount: 100, status: 'paid' },
    { date: '2025-04-02', amount: 150, status: 'pending' },
  ];

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('date', {
      header: 'التاريخ',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('amount', {
      header: 'المبلغ',
      cell: info => `${info.getValue()} $`,
    }),
    columnHelper.accessor('status', {
      header: 'الحالة',
      cell: info => (
        <div className="flex items-center gap-1">
          {info.getValue() === 'paid' ? (
            <CircleCheck className="text-green-500" />
          ) : (
            <CircleX className="text-red-500" />
          )}
          {info.getValue() === 'paid' ? 'مكتمل' : 'معلق'}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-6 h-6 text-orange-500" />
        <h2 className="text-xl font-bold">سجل الصرفيات</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="p-2 text-right"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="border-t hover:bg-gray-50"
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="p-2"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutHistory;