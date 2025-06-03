// app/components/LeadTracking.jsx
"use client";
import { DataTable } from "./data-table";
import { leadsColumns } from "./columns";
import {leadsMock} from "./mock-data";

const LeadTracking = () => {
  return (
    <DataTable
      columns={leadsColumns}
      data={leadsMock}
      filters={[
        { type: "status", label: "الحالة" },
        { type: "source", label: "مصدر العميل" },
      ]}
    />
  );
};
export default LeadTracking ;