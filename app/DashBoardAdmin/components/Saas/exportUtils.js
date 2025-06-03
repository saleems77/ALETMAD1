// src/utils/exportUtils.js
import { utils, writeFile } from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data, fileName) => {
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const excelBuffer = writeFile(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};
