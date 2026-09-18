import test from "node:test";
import assert from "node:assert/strict";

import {
  aggregateRows,
  buildReportModel,
  extractRowsFromMatrix,
  filterProducts,
  filterOrders,
  mergeImportResults,
  normalizeDate,
  normalizeOrder,
  recalculateOrder,
  sortOrders,
  toNumber,
  validateProduct,
} from "../src/app-core.js";

test("finds the real header row and parses Thai dates from an Income sheet", () => {
  const rows = extractRowsFromMatrix([
    ["รายงานรายรับของฉัน"],
    ["จาก", "2025-09-30", "ถึง", "2026-09-16"],
    [],
    ["ยอดรวม (฿)"],
    ["ลำดับที่", "หมายเลขคำสั่งซื้อ", "ชื่อผู้ใช้ (ผู้ซื้อ)", "วันที่ทำการสั่งซื้อ", "สินค้าราคาปกติ", "ค่าคอมมิชชั่น", "ค่าธุรกรรมการชำระเงิน", "จำนวนเงินทั้งหมดที่โอนแล้ว (฿)"],
    ["1", "260912TU63GDNG", "buyer", "16/09/2026", "269", "-43", "-10", "216"],
  ]);

  assert.equal(rows.length, 1);
  assert.equal(rows[0]["หมายเลขคำสั่งซื้อ"], "260912TU63GDNG");
  assert.equal(rows[0]["วันที่ทำการสั่งซื้อ"], "16/09/2026");
  assert.equal(normalizeDate(rows[0]["วันที่ทำการสั่งซื้อ"]), "2026-09-16");
});

test("uses the transferred amount for an Income report without inventing Cost products", () => {
  const rows = extractRowsFromMatrix([
    ["Summary"],
    ["หมายเลขคำสั่งซื้อ", "วันที่ทำการสั่งซื้อ", "สินค้าราคาปกติ", "ค่าคอมมิชชั่น", "ค่าธุรกรรมการชำระเงิน", "จำนวนเงินทั้งหมดที่โอนแล้ว (฿)"],
    ["X-1", "2026-09-16", 269, -43, -10, 216],
  ]);
  const result = aggregateRows(rows);

  assert.deepEqual(result.orders[0], {
    oid: "X-1",
    date: "2026-09-16",
    month: "2026-09",
    gross: 269,
    cost: 0,
    fee: 53,
    profit: 216,
    percent: 80.2973977695,
    items: "ไม่ระบุสินค้า",
    lineItems: [],
  });
  assert.deepEqual(result.products, {});
});

test("normalizes Buddhist calendar dates", () => {
  assert.equal(normalizeDate("16/09/2569"), "2026-09-16");
});

test("aggregates rows into an order and keeps product cost data", () => {
  const rows = [
    {
      "หมายเลขคำสั่งซื้อ": "A-1",
      "วันที่ทำการสั่งซื้อ": "2026-09-15",
      "ชื่อสินค้า": "Mug",
      "ชื่อตัวเลือก": "Red",
      "จำนวน": 2,
      "ราคาขาย": 100,
      "ค่าคอมมิชชั่น": 5,
      "Transaction Fee": 2,
      "ค่าบริการ": 1,
    },
    {
      "หมายเลขคำสั่งซื้อ": "A-1",
      "วันที่ทำการสั่งซื้อ": "2026-09-15",
      "ชื่อสินค้า": "Pen",
      "ชื่อตัวเลือก": "",
      "จำนวน": 1,
      "ราคาขาย": 50,
      "ค่าคอมมิชชั่น": 2,
      "Transaction Fee": 1,
      "ค่าบริการ": 0,
    },
  ];

  const result = aggregateRows(rows, {
    SKU_3066816148: 60,
  });

  assert.deepEqual(result.orders, [
    {
      oid: "A-1",
      date: "2026-09-15",
      month: "2026-09",
      gross: 250,
      cost: 120,
      fee: 11,
      profit: 119,
      percent: 47.6,
      items: "Mug x2, Pen x1",
      lineItems: [
        { sku: "SKU_3066816148", name: "Mug (Red)", quantity: 2, unitPrice: 100 },
        { sku: "SKU_2483875", name: "Pen", quantity: 1, unitPrice: 50 },
      ],
    },
  ]);
  assert.equal(result.products.SKU_3066816148.name, "Mug");
  assert.equal(result.products.SKU_3066816148.cost, 60);
});

test("parses formatted spreadsheet numbers instead of turning them into zero", () => {
  assert.equal(toNumber("฿1,234.50"), 1234.5);
  assert.equal(toNumber("1 200"), 1200);
  assert.equal(toNumber("not a number"), 0);
});

test("calculates a missing order percentage in memory", () => {
  assert.equal(
    normalizeOrder({
      orderId: "A-1",
      gross: 250,
      profit: 119,
      items: "Mug x2",
    }).percent,
    47.6,
  );
});

test("filters orders by year and month without dropping orders with no item text", () => {
  const orders = [
    { orderId: "A-1", date: "2026-09-15", items: "Mug x2" },
    { orderId: "B-1", date: "2026-09-20", items: "" },
    { orderId: "C-1", date: "2026-08-01", items: "Pen x1" },
  ];

  assert.deepEqual(
    filterOrders(orders, { year: "2026", month: "09" }).map((order) => order.orderId),
    ["A-1", "B-1"],
  );
});

test("builds a PDF report model from the currently filtered orders", () => {
  const report = buildReportModel([
    {
      orderId: "A-1",
      date: "2026-09-15",
      items: "Mug x2",
      gross: 250,
      cost: 120,
      fee: 11,
      profit: 119,
      percent: 47.6,
    },
    {
      orderId: "B-1",
      date: "2025-12-20",
      items: "Pen x1",
      gross: 50,
      cost: 20,
      fee: 3,
      profit: 27,
      percent: 54,
    },
  ], { year: "2026", month: "09", sort: "profit-desc" });

  assert.equal(report.orders.length, 1);
  assert.equal(report.orders[0].orderId, "A-1");
  assert.deepEqual(report.summary, {
    gross: 250,
    cost: 120,
    fee: 11,
    profit: 119,
  });
});

test("sorts orders by date, profit, and gross with stable tie breaking", () => {
  const orders = [
    { orderId: "B", date: "2026-09-01", gross: 100, profit: 20 },
    { orderId: "A", date: "2026-09-03", gross: 300, profit: 20 },
    { orderId: "C", date: "2026-09-02", gross: 200, profit: 50 },
  ];

  assert.deepEqual(sortOrders(orders, "newest").map((order) => order.orderId), ["A", "C", "B"]);
  assert.deepEqual(sortOrders(orders, "oldest").map((order) => order.orderId), ["B", "C", "A"]);
  assert.deepEqual(sortOrders(orders, "profit-desc").map((order) => order.orderId), ["C", "A", "B"]);
  assert.deepEqual(sortOrders(orders, "gross-desc").map((order) => order.orderId), ["A", "C", "B"]);
});

test("filters incomplete products for Cost cleanup", () => {
  const products = {
    SKU_A: { name: "Mug", cost: 60 },
    SKU_B: { name: "", cost: 0 },
    SKU_C: { name: "Pen", cost: 0 },
  };

  assert.deepEqual(Object.keys(filterProducts(products, "missing-name")), ["SKU_B"]);
  assert.deepEqual(Object.keys(filterProducts(products, "zero-cost")), ["SKU_B", "SKU_C"]);
  assert.equal(validateProduct({ sku: "SKU_A", name: "Mug", cost: 60 }).valid, true);
  assert.equal(validateProduct({ sku: "SKU_A", name: "", cost: 60 }).valid, false);
  assert.equal(validateProduct({ sku: "bad/id", name: "Mug", cost: 60 }).valid, false);
});

test("joins Orders product details with Income payout data and recalculates cost", () => {
  const orderResult = aggregateRows([
    {
      "หมายเลขคำสั่งซื้อ": "A-1",
      "วันที่ทำการสั่งซื้อ": "2026-09-15",
      "ชื่อสินค้า": "Mug",
      "ชื่อตัวเลือก": "Red",
      "จำนวน": 2,
      "ราคาขาย": 100,
    },
  ], { SKU_3066816148: 60 });
  const incomeResult = aggregateRows([
    {
      "หมายเลขคำสั่งซื้อ": "A-1",
      "วันที่ทำการสั่งซื้อ": "2026-09-15",
      "ราคาขาย": 200,
      "จำนวนเงินทั้งหมดที่โอนแล้ว (฿)": 180,
    },
  ]);

  const merged = mergeImportResults(orderResult, incomeResult, { SKU_3066816148: 60 });
  assert.equal(merged.orders[0].gross, 200);
  assert.equal(merged.orders[0].fee, 20);
  assert.equal(merged.orders[0].cost, 120);
  assert.equal(merged.orders[0].profit, 60);
  assert.equal(merged.orders[0].lineItems[0].sku, "SKU_3066816148");

  const recalculated = recalculateOrder(merged.orders[0], { SKU_3066816148: 80 });
  assert.equal(recalculated.cost, 160);
  assert.equal(recalculated.profit, 20);
});
