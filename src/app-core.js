const ORDER_ID_FIELD = "หมายเลขคำสั่งซื้อ";
const ORDER_DATE_FIELD = "วันที่ทำการสั่งซื้อ";
const PRODUCT_NAME_FIELD = "ชื่อสินค้า";
const PRODUCT_OPTION_FIELD = "ชื่อตัวเลือก";
const QUANTITY_FIELD = "จำนวน";
const SALE_PRICE_FIELD = "ราคาขาย";
const TRANSFER_FIELD = "จำนวนเงินทั้งหมดที่โอนแล้ว (฿)";
const COMMISSION_FIELD = "ค่าคอมมิชชั่น";
const TRANSACTION_FEE_FIELD = "Transaction Fee";
const SERVICE_FEE_FIELD = "ค่าบริการ";

const PRODUCT_ADJUSTMENT_FIELDS = [
  "ส่วนลดสินค้าจากผู้ขาย",
  "จำนวนเงินที่ทำการคืนให้ผู้ซื้อ",
  "ส่วนลดสินค้าที่ออกโดย Shopee",
  "โค้ดส่วนลดที่ออกโดยผู้ขาย",
  "โค้ดส่วนลดร่วมที่ออกโดยผู้ขาย",
  "Coins Cashback ที่สนับสนุนโดยผู้ขาย",
  "Coins Cashback ร่วมที่สนับสนุนโดยผู้ขาย",
];

const HEADER_ALIASES = {
  [ORDER_ID_FIELD]: [
    "หมายเลขคำสั่งซื้อ",
    "หมายเลขออเดอร์",
    "เลขที่คำสั่งซื้อ",
    "รหัสคำสั่งซื้อ",
    "order id",
    "orderid",
    "order",
  ],
  [ORDER_DATE_FIELD]: [
    "วันที่ทำการสั่งซื้อ",
    "วันที่สั่งซื้อ",
    "วันเวลาที่สั่งซื้อ",
    "เวลาสั่งซื้อ",
    "วันที่",
    "order date",
    "created at",
  ],
  [PRODUCT_NAME_FIELD]: [
    "ชื่อสินค้า",
    "ชื่อรายการ",
    "รายการสินค้า",
    "product",
    "product name",
    "item",
    "item name",
  ],
  [PRODUCT_OPTION_FIELD]: [
    "ชื่อตัวเลือก",
    "ตัวเลือก",
    "สินค้า/ตัวเลือก",
    "variation",
    "option",
  ],
  [QUANTITY_FIELD]: ["จำนวน", "จำนวนสินค้า", "qty", "quantity"],
  [SALE_PRICE_FIELD]: [
    "ราคาขาย",
    "ราคาสินค้า",
    "ยอดขาย",
    "มูลค่าสินค้า",
    "สินค้าราคาปกติ",
    "price",
    "sale price",
    "amount",
  ],
  [TRANSFER_FIELD]: [
    "จำนวนเงินทั้งหมดที่โอนแล้ว (฿)",
    "จำนวนเงินที่โอนแล้ว",
    "ยอดโอนสุทธิ",
    "ยอดเงินโอน",
    "payout",
    "net payout",
  ],
  [COMMISSION_FIELD]: ["ค่าคอมมิชชั่น", "ค่าคอมมิชชัน", "commission"],
  [TRANSACTION_FEE_FIELD]: [
    "transaction fee",
    "ค่าธรรมเนียมธุรกรรม",
    "ค่าธรรมเนียมการทำธุรกรรม",
    "ค่าธุรกรรมการชำระเงิน",
  ],
  [SERVICE_FEE_FIELD]: ["ค่าบริการ", "ค่าบริการอื่น", "service fee", "service"],
  "ส่วนลดสินค้าจากผู้ขาย": ["ส่วนลดสินค้าจากผู้ขาย", "seller discount"],
  "จำนวนเงินที่ทำการคืนให้ผู้ซื้อ": ["จำนวนเงินที่ทำการคืนให้ผู้ซื้อ", "refund"],
  "ส่วนลดสินค้าที่ออกโดย Shopee": ["ส่วนลดสินค้าที่ออกโดย Shopee"],
  "โค้ดส่วนลดที่ออกโดยผู้ขาย": ["โค้ดส่วนลดที่ออกโดยผู้ขาย"],
  "โค้ดส่วนลดร่วมที่ออกโดยผู้ขาย": ["โค้ดส่วนลดร่วมที่ออกโดยผู้ขาย"],
  "Coins Cashback ที่สนับสนุนโดยผู้ขาย": ["Coins Cashback ที่สนับสนุนโดยผู้ขาย"],
  "Coins Cashback ร่วมที่สนับสนุนโดยผู้ขาย": ["Coins Cashback ร่วมที่สนับสนุนโดยผู้ขาย"],
  "ค่าคอมมิชชั่น AMS": ["ค่าคอมมิชชั่น AMS", "ams commission"],
  "ค่าธรรมเนียมโครงสร้างพื้นฐานแพลตฟอร์ม": ["ค่าธรรมเนียมโครงสร้างพื้นฐานแพลตฟอร์ม"],
  "ค่าธรรมเนียม ของโปรแกรมประหยัดค่าจัดส่ง": ["ค่าธรรมเนียม ของโปรแกรมประหยัดค่าจัดส่ง"],
  "ภาษี": ["ภาษี", "tax"],
  "ค่าธรรมเนียมเติมเงินโฆษณาจากเงิน Escrow": ["ค่าธรรมเนียมเติมเงินโฆษณาจากเงิน Escrow"],
  "ค่าบริการติดตั้งจริงจากผู้ให้บริการ": ["ค่าบริการติดตั้งจริงจากผู้ให้บริการ"],
};

function normalizeHeader(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\uFEFF\r\n\t]/g, " ")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9ก-๙]/g, "");
}

const normalizedAliases = Object.fromEntries(
  Object.entries(HEADER_ALIASES).map(([field, aliases]) => [
    field,
    new Set(aliases.map(normalizeHeader).filter(Boolean)),
  ]),
);

function findHeaderIndexes(headerRow = []) {
  const indexes = {};
  headerRow.forEach((value, index) => {
    const normalized = normalizeHeader(value);
    if (!normalized) return;

    for (const [field, aliases] of Object.entries(normalizedAliases)) {
      if (!(field in indexes) && aliases.has(normalized)) {
        indexes[field] = index;
      }
    }
  });
  return indexes;
}

function headerScore(indexes) {
  if (!(ORDER_ID_FIELD in indexes)) return -1;
  let score = 10;
  if (ORDER_DATE_FIELD in indexes) score += 3;
  if (PRODUCT_NAME_FIELD in indexes) score += 3;
  if (SALE_PRICE_FIELD in indexes) score += 2;
  if (TRANSFER_FIELD in indexes) score += 2;
  return score + Object.keys(indexes).length / 100;
}

function hasValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function rowFromIndexes(row, indexes) {
  const result = {};
  for (const [field, index] of Object.entries(indexes)) {
    result[field] = row?.[index] ?? "";
  }
  return result;
}

/**
 * Finds a table header in the first part of a worksheet and maps its rows to
 * the fields used by the dashboard. Shopee reports often put a title and
 * report metadata above the actual header row.
 */
export function parseSpreadsheetRows(matrix = []) {
  const candidateRows = Array.isArray(matrix) ? matrix.slice(0, 50) : [];
  let best = null;

  candidateRows.forEach((row, index) => {
    const indexes = findHeaderIndexes(Array.isArray(row) ? row : []);
    const score = headerScore(indexes);
    if (score >= 0 && (!best || score > best.score)) {
      best = { headerRowIndex: index, indexes, score };
    }
  });

  if (!best) {
    return {
      rows: [],
      headerRowIndex: -1,
      headers: [],
      hasOrderId: false,
      profile: "unknown",
    };
  }

  const header = Array.isArray(matrix[best.headerRowIndex])
    ? matrix[best.headerRowIndex]
    : [];
  const rows = [];
  for (const row of matrix.slice(best.headerRowIndex + 1)) {
    const parsed = rowFromIndexes(Array.isArray(row) ? row : [], best.indexes);
    if (hasValue(parsed[ORDER_ID_FIELD])) rows.push(parsed);
  }

  return {
    rows,
    headerRowIndex: best.headerRowIndex,
    headers: header.map((value) => String(value ?? "").trim()).filter(Boolean),
    hasOrderId: true,
    profile: TRANSFER_FIELD in best.indexes ? "income" : "orders",
  };
}

export function extractRowsFromMatrix(matrix = []) {
  return parseSpreadsheetRows(matrix).rows;
}

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

function productCost(product) {
  if (product && typeof product === "object" && !Array.isArray(product)) {
    return toNumber(product.cost);
  }
  return toNumber(product);
}

function normalizeLineItems(lineItems = []) {
  if (!Array.isArray(lineItems)) return [];

  return lineItems
    .map((item) => ({
      sku: String(item?.sku ?? "").trim(),
      name: String(item?.name ?? "").trim(),
      quantity: toNumber(item?.quantity) || 1,
      unitPrice: toNumber(item?.unitPrice),
    }))
    .filter((item) => item.sku || item.name);
}

function lineItemText(lineItems = []) {
  const text = normalizeLineItems(lineItems)
    .filter((item) => item.name)
    .map((item) => `${item.name} x${item.quantity}`);
  return text.length ? text.join(", ") : "ไม่ระบุสินค้า";
}

function isoDate(year, month, day = "") {
  let numericYear = Number(year);
  const numericMonth = Number(month);
  const numericDay = day === "" ? "" : Number(day);
  if (numericYear >= 2400 && numericYear <= 2700) numericYear -= 543;
  if (!Number.isInteger(numericYear) || numericYear < 1900 || numericYear > 2200) return "";
  if (!Number.isInteger(numericMonth) || numericMonth < 1 || numericMonth > 12) return "";
  if (numericDay !== "" && (!Number.isInteger(numericDay) || numericDay < 1 || numericDay > 31)) return "";

  if (numericDay === "") return `${numericYear}-${String(numericMonth).padStart(2, "0")}`;
  const date = new Date(Date.UTC(numericYear, numericMonth - 1, numericDay));
  if (
    date.getUTCFullYear() !== numericYear
    || date.getUTCMonth() !== numericMonth - 1
    || date.getUTCDate() !== numericDay
  ) return "";
  return `${numericYear}-${String(numericMonth).padStart(2, "0")}-${String(numericDay).padStart(2, "0")}`;
}

export function normalizeDate(value) {
  if (value && typeof value.toDate === "function") {
    return normalizeDate(value.toDate());
  }

  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const milliseconds = Math.round((value - 25569) * 86400 * 1000);
    const date = new Date(milliseconds);
    return Number.isNaN(date.valueOf()) ? "" : date.toISOString().slice(0, 10);
  }

  const text = String(value ?? "").trim();
  if (!text) return "";

  const serial = Number(text);
  if (/^\d+(?:\.\d+)?$/.test(text) && serial >= 20000 && serial <= 100000) {
    return normalizeDate(serial);
  }

  const isoMatch = text.match(/^(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?/);
  if (isoMatch) {
    return isoDate(isoMatch[1], isoMatch[2], isoMatch[3] ?? "") || text;
  }

  const separatedMatch = text.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  if (separatedMatch) {
    let [, first, second, year] = separatedMatch;
    let day = first;
    let month = second;
    if (Number(first) <= 12 && Number(second) > 12) {
      day = second;
      month = first;
    }
    return isoDate(year, month, day) || text;
  }

  return text;
}

function positiveFee(value) {
  return Math.abs(toNumber(value));
}

function incomeProductGross(row) {
  return [SALE_PRICE_FIELD, ...PRODUCT_ADJUSTMENT_FIELDS]
    .reduce((sum, field) => sum + toNumber(row?.[field]), 0);
}

function hasIncomePayout(row) {
  return hasValue(row?.[TRANSFER_FIELD]);
}

export function aggregateRows(rows, costMap = {}) {
  const grouped = new Map();
  const products = {};

  for (const row of rows) {
    const orderId = String(row?.[ORDER_ID_FIELD] ?? "").trim();
    if (!orderId) continue;

    const rawName = String(row?.[PRODUCT_NAME_FIELD] ?? "").trim();
    const hasProductName = Boolean(rawName);
    const name = rawName || "ไม่ระบุสินค้า";
    const option = String(row?.[PRODUCT_OPTION_FIELD] ?? "").trim();
    const displayName = option ? `${name} (${option})` : name;
    const sku = hashSKU(`${name}|${option}`);
    const rawQuantity = toNumber(row?.[QUANTITY_FIELD]);
    const quantity = rawQuantity || 1;
    const date = normalizeDate(row?.[ORDER_DATE_FIELD]);
    const incomePayout = hasIncomePayout(row);
    const gross = incomePayout ? incomeProductGross(row) : toNumber(row?.[SALE_PRICE_FIELD]) * quantity;
    const unitCost = hasProductName ? productCost(costMap[sku]) : 0;
    const fee = incomePayout
      ? gross - toNumber(row?.[TRANSFER_FIELD])
      : positiveFee(row?.[COMMISSION_FIELD])
        + positiveFee(row?.[TRANSACTION_FEE_FIELD])
        + positiveFee(row?.[SERVICE_FEE_FIELD]);

    if (!grouped.has(orderId)) {
      grouped.set(orderId, {
        oid: orderId,
        date,
        month: date.slice(0, 7),
        gross: 0,
        cost: 0,
        fee: 0,
        items: [],
        lineItems: [],
      });
    }

    const order = grouped.get(orderId);
    order.gross += gross;
    order.cost += unitCost * quantity;
    order.fee += fee;
    if (hasProductName) {
      order.items.push(`${name} x${quantity}`);
      order.lineItems.push({
        sku,
        name: displayName,
        quantity,
        unitPrice: toNumber(row?.[SALE_PRICE_FIELD]),
      });
      products[sku] = {
        name,
        displayName,
        cost: unitCost,
      };
    }
  }

  const orders = [...grouped.values()].map((order) => {
    const profit = order.gross - order.cost - order.fee;
    return {
      oid: order.oid,
      date: order.date,
      month: order.month,
      gross: order.gross,
      cost: order.cost,
      fee: order.fee,
      profit,
      percent: calculatePercent(order.gross, profit),
      items: order.items.length ? order.items.join(", ") : "ไม่ระบุสินค้า",
      lineItems: normalizeLineItems(order.lineItems),
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
  const date = normalizeDate(order.date);

  return {
    ...order,
    orderId: String(order.orderId ?? order.oid ?? ""),
    date,
    month: date ? date.slice(0, 7) : String(order.month ?? ""),
    items: String(order.items ?? ""),
    lineItems: normalizeLineItems(order.lineItems),
    gross,
    cost,
    fee,
    profit,
    percent,
  };
}

export function recalculateOrder(order = {}, costMap = {}) {
  const normalized = normalizeOrder(order);
  if (!normalized.lineItems.length) return normalized;

  const cost = normalized.lineItems.reduce(
    (sum, item) => sum + productCost(costMap[item.sku]) * item.quantity,
    0,
  );
  const profit = normalized.gross - cost - normalized.fee;

  return {
    ...normalized,
    cost,
    profit,
    percent: calculatePercent(normalized.gross, profit),
    items: lineItemText(normalized.lineItems),
  };
}

export function filterOrders(orders, { year = "", month = "" } = {}) {
  return orders.filter((rawOrder) => {
    const date = normalizeDate(rawOrder?.date);
    if (year && !date.startsWith(year)) return false;
    if (month && date.slice(5, 7) !== month) return false;
    return true;
  });
}

export function sortOrders(orders = [], mode = "newest") {
  const direction = mode === "oldest" ? 1 : -1;
  const numericMode = new Set([
    "profit-desc",
    "profit-asc",
    "gross-desc",
    "gross-asc",
  ]).has(mode);

  return orders
    .map((order, index) => ({ order, index, normalized: normalizeOrder(order) }))
    .sort((left, right) => {
      let comparison = 0;
      if (mode === "newest" || mode === "oldest") {
        comparison = left.normalized.date.localeCompare(right.normalized.date);
        comparison *= direction;
      } else if (numericMode) {
        const field = mode.startsWith("profit") ? "profit" : "gross";
        comparison = left.normalized[field] - right.normalized[field];
        if (mode.endsWith("-desc")) comparison *= -1;
      }

      if (comparison !== 0) return comparison;
      const orderIdComparison = left.normalized.orderId.localeCompare(right.normalized.orderId);
      return orderIdComparison || left.index - right.index;
    })
    .map(({ order }) => order);
}

export function filterProducts(products = {}, filter = "all") {
  const entries = Array.isArray(products)
    ? products.map((product) => [String(product?.sku ?? ""), product])
    : Object.entries(products);
  const result = {};

  for (const [sku, product] of entries) {
    const name = String(product?.name ?? "").trim();
    const cost = productCost(product);
    const matches = filter === "missing-name"
      ? !name
      : filter === "zero-cost"
        ? cost === 0
        : filter === "incomplete"
          ? !name || cost === 0
          : true;
    if (matches) result[sku] = product;
  }

  return result;
}

export function validateProduct({ sku = "", name = "", cost } = {}) {
  const errors = [];
  const normalizedSku = String(sku).trim();
  const normalizedName = String(name).trim();
  const costText = typeof cost === "string" ? cost.trim() : cost;
  const parsedCost = typeof costText === "number"
    ? costText
    : costText === ""
      ? Number.NaN
      : Number(String(costText).replace(/,/g, ""));

  if (!normalizedSku || normalizedSku.includes("/")) errors.push("invalid-sku");
  if (!normalizedName || normalizedName.length > 500) errors.push("invalid-name");
  if (!Number.isFinite(parsedCost) || parsedCost < 0 || parsedCost > 1000000000) {
    errors.push("invalid-cost");
  }

  return { valid: errors.length === 0, errors };
}

export function mergeImportResults(orderResult = {}, incomeResult = {}, costMap = {}) {
  const detailOrders = new Map((orderResult.orders || []).map((order) => [String(order.oid ?? order.orderId), order]));
  const incomeOrders = new Map((incomeResult.orders || []).map((order) => [String(order.oid ?? order.orderId), order]));
  const productEntries = {
    ...(orderResult.products || {}),
    ...(incomeResult.products || {}),
  };
  const effectiveCosts = { ...productEntries, ...costMap };
  const ids = [...new Set([...detailOrders.keys(), ...incomeOrders.keys()])];

  const orders = ids.map((id) => {
    const detail = detailOrders.get(id);
    const income = incomeOrders.get(id);
    const lineItems = normalizeLineItems(detail?.lineItems);
    const base = {
      oid: id,
      date: income?.date || detail?.date || "",
      month: (income?.date || detail?.date || "").slice(0, 7),
      gross: income ? toNumber(income.gross) : toNumber(detail?.gross),
      cost: detail ? toNumber(detail.cost) : 0,
      fee: income ? toNumber(income.fee) : toNumber(detail?.fee),
      items: detail?.items || income?.items || "ไม่ระบุสินค้า",
      lineItems,
    };
    const merged = recalculateOrder(base, effectiveCosts);
    const profit = merged.gross - merged.cost - merged.fee;
    return {
      ...merged,
      profit,
      percent: calculatePercent(merged.gross, profit),
    };
  });

  const products = Object.fromEntries(Object.entries(productEntries).map(([sku, product]) => [
    sku,
    {
      ...(product && typeof product === "object" ? product : {}),
      cost: productCost(effectiveCosts[sku]),
    },
  ]));

  return { orders, products };
}

function hasProductDetails(order) {
  return Array.isArray(order?.lineItems) && order.lineItems.length > 0;
}

function hasKnownItems(order) {
  const items = String(order?.items ?? "").trim();
  return Boolean(items) && items !== "ไม่ระบุสินค้า";
}

export function mergeOrdersWithExisting(importedOrders = [], existingOrders = [], costMap = {}) {
  const existingById = new Map(
    existingOrders.map((order) => [normalizeOrder(order).orderId, normalizeOrder(order)]),
  );

  return importedOrders.map((rawOrder) => {
    const imported = normalizeOrder(rawOrder);
    const existing = existingById.get(imported.orderId);
    if (!existing) return recalculateOrder(imported, costMap);

    const importedHasDetails = hasProductDetails(imported);
    const existingHasDetails = hasProductDetails(existing);
    const merged = {
      ...existing,
      ...imported,
      lineItems: importedHasDetails ? imported.lineItems : existing.lineItems,
      items: importedHasDetails || !hasKnownItems(existing)
        ? imported.items
        : existing.items,
    };

    // An Orders export supplies product details but its gross/fee columns are
    // not the payout figures from an Income export. Keep the existing payout
    // snapshot when enriching an Income-only order.
    if (importedHasDetails && !existingHasDetails) {
      merged.date = existing.date || imported.date;
      merged.month = existing.month || imported.month;
      merged.gross = existing.gross;
      merged.fee = existing.fee;
    }

    return recalculateOrder(merged, costMap);
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
      if (name && name !== "ไม่ระบุสินค้า") products[name] = (products[name] || 0) + order.profit;
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

export function buildReportModel(orders, filters = {}) {
  const filtered = sortOrders(
    filterOrders(orders.map(normalizeOrder), filters),
    filters.sort || "newest",
  ).map(normalizeOrder);
  const summary = filtered.reduce((totals, order) => ({
    gross: totals.gross + order.gross,
    cost: totals.cost + order.cost,
    fee: totals.fee + order.fee,
    profit: totals.profit + order.profit,
  }), { gross: 0, cost: 0, fee: 0, profit: 0 });

  return {
    filters: {
      year: filters.year || "",
      month: filters.month || "",
      sort: filters.sort || "newest",
    },
    summary,
    orders: filtered,
    monthly: summarizeOrders(filtered).monthly,
  };
}
