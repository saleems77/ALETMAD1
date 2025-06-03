// app/components/data-table.jsx
"use client";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { useMemo } from "react";

export const DataTable = ({ columns, data, filters = [] }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* عرض الجدول */}
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : header.column.columnDef.header}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.renderValue()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};