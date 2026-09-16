const ORDER_ID_FIELD = "หมายเลขคำสั่งซื้อ";
const ORDER_DATE_FIELD = "วันที่ทำการสั่งซื้อ";
const PRODUCT_NAME_FIELD = "ชื่อสินค้า";
const PRODUCT_OPTION_FIELD = "ชื่อตัวเลือก";
const QUANTITY_FIELD = "จำนวน";
const SALE_PRICE_FIELD = "ราคาขาย";
const COMMISSION_FIELD = "ค่าคอมมิชชั่น";
const TRANSACTION_FEE_FIELD = "Transaction Fee";
const SERVICE_FEE_FIELD = "ค่าบริการ";

export function toNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value !== "string") return 0;

  const cleaned = value
    .replace(/[฿$€£,\s]/g, "")
    .replace(/[^0-9.+-]/g, "");
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : 0;
}

export function hashSKU(value) {
  let hash = 0;
  for (const character of String(value)) {
    hash = ((hash << 5) - hash) + character.charCodeAt(0);
  }
  return `SKU_${Math.abs(hash)}`;
}

function calculatePercent(gross, profit) {
  return gross ? Number(((profit / gross) * 100).toFixed(10)) : 0;
}

export function normalizeDate(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const milliseconds = Math.round((value - 25569) * 86400 * 1000);
    const date = new Date(milliseconds);
    return Number.isNaN(date.valueOf()) ? "" : date.toISOString().slice(0, 10);
  }

  const text = String(value ?? "").trim();
  const match = text.match(/^(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?/);
  if (!match) return text;

  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, "0")}${day ? `-${day.padStart(2, "0")}` : ""}`;
}

export function aggregateRows(rows, costMap = {}) {
  const grouped = new Map();
  const products = {};

  for (const row of rows) {
    const orderId = String(row?.[ORDER_ID_FIELD] ?? "").trim();
    if (!orderId) continue;

    const name = String(row?.[PRODUCT_NAME_FIELD] ?? "").trim() || "ไม่ระบุสินค้า";
    const option = String(row?.[PRODUCT_OPTION_FIELD] ?? "").trim();
    const sku = hashSKU(`${name}|${option}`);
    const rawQuantity = toNumber(row?.[QUANTITY_FIELD]);
    const quantity = rawQuantity || 1;
    const price = toNumber(row?.[SALE_PRICE_FIELD]);
    const unitCost = toNumber(costMap[sku]);
    const date = normalizeDate(row?.[ORDER_DATE_FIELD]);

    if (!grouped.has(orderId)) {
      grouped.set(orderId, {
        oid: orderId,
        date,
        month: date.slice(0, 7),
        gross: 0,
        cost: 0,
        fee: 0,
        items: [],
      });
    }

    const order = grouped.get(orderId);
    order.gross += price * quantity;
    order.cost += unitCost * quantity;
    order.fee += toNumber(row?.[COMMISSION_FIELD])
      + toNumber(row?.[TRANSACTION_FEE_FIELD])
      + toNumber(row?.[SERVICE_FEE_FIELD]);
    order.items.push(`${name} x${quantity}`);

    products[sku] = {
      name,
      cost: unitCost,
    };
  }

  const orders = [...grouped.values()].map((order) => {
    const profit = order.gross - order.cost - order.fee;
    return {
      ...order,
      profit,
      percent: calculatePercent(order.gross, profit),
      items: order.items.join(", "),
    };
  });

  return { orders, products };
}

export function normalizeOrder(order = {}) {
  const gross = toNumber(order.gross);
  const cost = toNumber(order.cost);
  const fee = toNumber(order.fee);
  const profit = Object.hasOwn(order, "profit")
    ? toNumber(order.profit)
    : gross - cost - fee;
  const percent = Object.hasOwn(order, "percent")
    ? toNumber(order.percent)
    : calculatePercent(gross, profit);

  return {
    ...order,
    orderId: String(order.orderId ?? ""),
    date: normalizeDate(order.date),
    items: String(order.items ?? ""),
    gross,
    cost,
    fee,
    profit,
    percent,
  };
}

export function filterOrders(orders, { year = "", month = "" } = {}) {
  return orders.filter((order) => {
    const date = String(order.date ?? "");
    if (year && !date.startsWith(year)) return false;
    if (month && date.slice(5, 7) !== month) return false;
    return true;
  });
}

export function summarizeOrders(orders) {
  const monthly = {};
  const products = {};

  for (const rawOrder of orders) {
    const order = normalizeOrder(rawOrder);
    if (order.date) {
      const month = order.date.slice(0, 7);
      monthly[month] = (monthly[month] || 0) + order.profit;
    }

    for (const item of order.items.split(",")) {
      const name = item.trim();
      if (name) products[name] = (products[name] || 0) + order.profit;
    }
  }

  return {
    netRevenue: orders.reduce((sum, order) => {
      const normalized = normalizeOrder(order);
      return sum + normalized.gross - normalized.fee;
    }, 0),
    profit: orders.reduce((sum, order) => sum + normalizeOrder(order).profit, 0),
    monthly: Object.entries(monthly).sort(([a], [b]) => a.localeCompare(b)),
    topProducts: Object.entries(products)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10),
  };
}
