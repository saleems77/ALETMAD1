'use client';
import { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import OfferBadge from './OfferBadge';

const ActiveOffersList = () => {
  // بيانات وهمية ثابتة
  const data = useMemo(() => [
    {
      code: 'OFFER123',
      value: '20%',
      startDate: '2025-04-01',
      endDate: '2025-04-15',
    },
    {
      code: 'SPRING50',
      value: '50%',
      startDate: '2025-04-05',
      endDate: '2025-04-20',
    },
  ], []);

  const columnHelper = createColumnHelper();

  // تعريف الأعمدة
  const columns = useMemo(() => [
    columnHelper.accessor('code', {
      header: 'الكود',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('value', {
      header: 'القيمة',
      cell: info => info.getValue(),
    }),
    columnHelper.display({
      id: 'status',
      header: 'الحالة',
      cell: ({ row }) => (
        <OfferBadge 
          start={row.original.startDate} 
          end={row.original.endDate} 
        />
      )
    }),
    columnHelper.display({
      id: 'period',
      header: 'الفترة',
      cell: ({ row }) => {
        const start = new Date(row.original.startDate).toLocaleDateString();
        const end = new Date(row.original.endDate).toLocaleDateString();
        return `${start} - ${end}`;
      }
    })
  ], []);

  // إنشاء الجدول
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">العروض النشطة</h2>
      
      <table className="w-full">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="p-3 text-right">
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
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-3 border-t">
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
  );
};

export default ActiveOffersList;