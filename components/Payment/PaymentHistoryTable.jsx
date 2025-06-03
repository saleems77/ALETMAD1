'use client';
import { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import PaymentStatusBadge from './PaymentStatusBadge';

const dummyTransactions = [
  { id: 1, amount: 100, method: 'بطاقة ائتمان', status: 'completed', date: '2023-04-10' },
  { id: 2, amount: 50, method: 'Apple Pay', status: 'pending', date: '2023-04-11' },
];

const PaymentHistoryTable = () => {
  const data = useMemo(() => dummyTransactions, []);
  
  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor('amount', {
        header: 'المبلغ',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('method', {
        header: 'الطريقة',
        cell: info => info.getValue(),
      }),
      columnHelper.display({
        id: 'status',
        header: 'الحالة',
        cell: ({ row }) => (
          <PaymentStatusBadge status={row.original.status} />
        ),
      }),
      columnHelper.accessor('date', {
        header: 'التاريخ',
        cell: info => info.getValue(),
      }),
    ],
    []
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-right font-medium text-gray-500"
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
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 text-gray-700"
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
  );
};

export default PaymentHistoryTable;