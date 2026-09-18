import fs from "node:fs/promises";
import ExcelJS from "exceljs";
import {
  aggregateRows,
  filterOrders,
  normalizeOrder,
  parseSpreadsheetRows,
} from "../src/app-core.js";

const argumentsList = process.argv.slice(2);
const output = argumentsList.at(-1)?.endsWith(".json") ? argumentsList.pop() : "";
if (!argumentsList.length) {
  console.error("Usage: node automation/prepare-orders-import.mjs <xlsx-file> [...xlsx-file] [json-output]");
  process.exitCode = 1;
} else {
  const rows = [];
  const files = [];
  for (const filename of argumentsList) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filename);
    const parsedSheets = workbook.worksheets.map((worksheet) => {
      const matrix = [];
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        matrix[rowNumber - 1] = row.values.slice(1).map((cell) => {
          if (!cell || typeof cell !== "object") return cell ?? "";
          return cell.result ?? cell.text ?? cell.value ?? "";
        });
      });
      return parseSpreadsheetRows(matrix);
    });
    const best = [...parsedSheets]
      .filter((sheet) => sheet.rows.length)
      .sort((left, right) => right.rows.length - left.rows.length)[0];
    if (best?.profile === "orders") {
      rows.push(...best.rows);
      files.push(filename);
    }
  }

  const result = aggregateRows(rows);
  const orders = filterOrders(result.orders.map(normalizeOrder), { year: "2026" });
  const payload = {
    version: 1,
    files,
    rawRows: rows.length,
    orders2026: orders,
    products: result.products,
  };
  const text = JSON.stringify(payload, null, 2);
  if (output) await fs.writeFile(output, text);
  else console.log(text);
}
