import ExcelJS from "exceljs";
import {
  aggregateRows,
  filterOrders,
  mergeImportResults,
  normalizeOrder,
  parseSpreadsheetRows,
} from "../src/app-core.js";

const filename = process.argv[2];
if (!filename) {
  console.error("Usage: node automation/verify-import.mjs <xlsx-file>");
  process.exitCode = 1;
} else {
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
    return {
      sheetName: worksheet.name,
      ...parseSpreadsheetRows(matrix),
    };
  });

  const selectedSheet = [...parsedSheets]
    .filter((sheet) => sheet.rows.length)
    .sort((left, right) => right.rows.length - left.rows.length)[0];
  const orderRows = selectedSheet?.profile === "orders" ? selectedSheet.rows : [];
  const incomeRows = selectedSheet?.profile === "income" ? selectedSheet.rows : [];
  const result = mergeImportResults(
    aggregateRows(orderRows),
    aggregateRows(incomeRows),
  );
  const selected = filterOrders(result.orders.map(normalizeOrder), { year: "2026" });
  const dates = selected.map((order) => order.date).filter(Boolean).sort();

  console.log(JSON.stringify({
    file: filename,
    sheets: parsedSheets.map(({ sheetName, profile, rows }) => ({
      sheetName,
      profile,
      rows: rows.length,
    })),
    selectedSheet: selectedSheet?.sheetName || "",
    rawRows: orderRows.length + incomeRows.length,
    orders: result.orders.length,
    orders2026: selected.length,
    excludedFrom2026: result.orders.length - selected.length,
    unknownProducts2026: selected.filter((order) => !order.lineItems.length).length,
    dateRange2026: dates.length ? [dates[0], dates.at(-1)] : [],
  }, null, 2));
}
