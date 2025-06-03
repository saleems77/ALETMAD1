'use client';
import * as React from "react";
import { cn } from "@/lib/utils";

interface TableProps extends React.ComponentProps<"table"> {
  hoverable?: boolean;
}

function Table({ hoverable, className, ...props }: TableProps) {
  // استخدم الخاصية hoverable لإضافة كلاسات مخصصة إذا كانت true
  const extraClass = hoverable ? "hoverable-class" : "";

  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      {/* لا تمرر hoverable هنا */}
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", extraClass, className)}
        {...props}
      />
    </div>
  );
}

// تجميع المكونات الفرعية كما فعلنا سابقًا
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn(className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className)}
      {...props}
    />
  );
}

function TableHeadCell({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head-cell"
      className={cn("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap", className)}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("p-2 align-middle whitespace-nowrap", className)}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

const TableComponent = Object.assign(Table, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  HeadCell: TableHeadCell,
  Cell: TableCell,
  Caption: TableCaption,
});

export default TableComponent;
