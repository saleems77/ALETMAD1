// DataTable.jsx
"use client"; // ← ضروري لاستخدام React Hooks
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useMemo } from "react";

export const DataTable = ({ columns, data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-50">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-3 text-right border-b">
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
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 text-right border-b">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                لا توجد بيانات متاحة
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};