// src/utils/exporters.js
import Papa from "papaparse";
import { utils, writeFile } from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// تصدير إلى CSV
export const exportToCSV = (data, filename) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
};

// تصدير إلى Excel
export const exportToExcel = (data, filename) => {
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");
  writeFile(workbook, `${filename}.xlsx`);
};

// تصدير إلى PDF
export const exportToPDF = (data, filename) => {
  const doc = new jsPDF();
  const columns = Object.keys(data[0]);
  const rows = data.map((item) => Object.values(item));

  doc.autoTable({
    head: [columns.map((col) => col.toUpperCase())],
    body: rows,
    styles: { fontSize: 10, halign: "right" },
    theme: "grid",
  });

  doc.save(`${filename}.pdf`);
};
