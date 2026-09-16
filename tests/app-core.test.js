import test from "node:test";
import assert from "node:assert/strict";

import {
  aggregateRows,
  filterOrders,
  normalizeOrder,
  toNumber,
} from "../src/app-core.js";

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
