import fs from "node:fs/promises";
import ExcelJS from "exceljs";
import {
  aggregateRows,
  filterOrders,
  mergeImportResults,
  normalizeOrder,
  parseSpreadsheetRows,
} from "../src/app-core.js";

const input = process.argv[2];
const output = process.argv[3];
if (!input) {
  console.error("Usage: node automation/prepare-income-import.mjs <xlsx-file> [json-output]");
  process.exitCode = 1;
} else {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(input);
  const parsedSheets = workbook.worksheets.map((worksheet) => {
    const matrix = [];
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      matrix[rowNumber - 1] = row.values.slice(1).map((cell) => {
        if (!cell || typeof cell !== "object") return cell ?? "";
        return cell.result ?? cell.text ?? cell.value ?? "";
      });
    });
    return { ...parseSpreadsheetRows(matrix), sheetName: worksheet.name };
  });

  const selectedSheet = [...parsedSheets]
    .filter((sheet) => sheet.rows.length)
    .sort((left, right) => right.rows.length - left.rows.length)[0];
  const sourceResult = selectedSheet?.profile === "income"
    ? aggregateRows(selectedSheet.rows)
    : aggregateRows([]);
  const orders = filterOrders(sourceResult.orders.map(normalizeOrder), { year: "2026" });
  const dates = orders.map((order) => order.date).filter(Boolean).sort();
  const payload = {
    version: 1,
    source: input,
    selectedSheet: selectedSheet?.sheetName || "",
    rawRows: selectedSheet?.rows.length || 0,
    totalOrders: sourceResult.orders.length,
    excludedFrom2026: sourceResult.orders.length - orders.length,
    orders2026: orders,
    products: mergeImportResults({}, sourceResult).products,
    dateRange2026: dates.length ? [dates[0], dates.at(-1)] : [],
  };
  const text = JSON.stringify(payload, null, 2);
  if (output) await fs.writeFile(output, text);
  else console.log(text);
}
