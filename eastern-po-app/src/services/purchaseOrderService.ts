import { getDatabase } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import { generatePoNumber } from "../utils/poNumberGenerator.js";
import type {
  PurchaseOrder,
  PurchaseOrderWithVendor,
  CreatePurchaseOrderInput,
  UpdatePurchaseOrderInput,
  PoStatus,
} from "../models/purchaseOrder.js";

export interface PoFilters {
  status?: string;
  vendor_id?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
}

export function getAllPurchaseOrders(filters: PoFilters = {}): PurchaseOrderWithVendor[] {
  const db = getDatabase();
  let query = `
    SELECT po.*, v.name as vendor_name
    FROM purchase_orders po
    JOIN vendors v ON po.vendor_id = v.id
    WHERE 1=1
  `;
  const params: unknown[] = [];

  if (filters.status) {
    query += " AND po.status = ?";
    params.push(filters.status);
  }
  if (filters.vendor_id) {
    query += " AND po.vendor_id = ?";
    params.push(filters.vendor_id);
  }
  if (filters.from_date) {
    query += " AND po.order_date >= ?";
    params.push(filters.from_date);
  }
  if (filters.to_date) {
    query += " AND po.order_date <= ?";
    params.push(filters.to_date);
  }
  if (filters.search) {
    query += " AND (po.po_number LIKE ? OR v.name LIKE ?)";
    const term = `%${filters.search}%`;
    params.push(term, term);
  }

  query += " ORDER BY po.created_at DESC";

  return db.prepare(query).all(...params) as PurchaseOrderWithVendor[];
}

export function getPurchaseOrderById(id: string): PurchaseOrderWithVendor | undefined {
  const db = getDatabase();
  return db
    .prepare(
      `SELECT po.*, v.name as vendor_name
       FROM purchase_orders po
       JOIN vendors v ON po.vendor_id = v.id
       WHERE po.id = ?`,
    )
    .get(id) as PurchaseOrderWithVendor | undefined;
}

export function createPurchaseOrder(input: CreatePurchaseOrderInput): PurchaseOrderWithVendor {
  const db = getDatabase();
  const id = uuidv4();
  const poNumber = generatePoNumber();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO purchase_orders (id, po_number, vendor_id, status, order_date, expected_delivery_date, notes, total_amount, created_at, updated_at)
     VALUES (?, ?, ?, 'draft', ?, ?, ?, 0, ?, ?)`,
  ).run(
    id,
    poNumber,
    input.vendor_id,
    input.order_date ?? new Date().toISOString().split("T")[0],
    input.expected_delivery_date ?? null,
    input.notes ?? null,
    now,
    now,
  );

  return getPurchaseOrderById(id)!;
}

export function updatePurchaseOrder(id: string, input: UpdatePurchaseOrderInput): PurchaseOrderWithVendor | undefined {
  const db = getDatabase();
  const existing = db.prepare("SELECT * FROM purchase_orders WHERE id = ?").get(id) as PurchaseOrder | undefined;
  if (!existing) return undefined;

  const updated = {
    vendor_id: input.vendor_id ?? existing.vendor_id,
    order_date: input.order_date ?? existing.order_date,
    expected_delivery_date: input.expected_delivery_date ?? existing.expected_delivery_date,
    notes: input.notes ?? existing.notes,
    updated_at: new Date().toISOString(),
  };

  db.prepare(
    `UPDATE purchase_orders SET vendor_id = ?, order_date = ?, expected_delivery_date = ?, notes = ?, updated_at = ?
     WHERE id = ?`,
  ).run(updated.vendor_id, updated.order_date, updated.expected_delivery_date, updated.notes, updated.updated_at, id);

  return getPurchaseOrderById(id)!;
}

export function updatePurchaseOrderStatus(id: string, status: PoStatus): PurchaseOrderWithVendor | undefined {
  const db = getDatabase();
  const existing = db.prepare("SELECT * FROM purchase_orders WHERE id = ?").get(id) as PurchaseOrder | undefined;
  if (!existing) return undefined;

  db.prepare("UPDATE purchase_orders SET status = ?, updated_at = ? WHERE id = ?").run(
    status,
    new Date().toISOString(),
    id,
  );

  return getPurchaseOrderById(id)!;
}

export function deletePurchaseOrder(id: string): boolean {
  const db = getDatabase();
  const result = db.prepare("DELETE FROM purchase_orders WHERE id = ?").run(id);
  return result.changes > 0;
}

export function recalculateTotal(poId: string): void {
  const db = getDatabase();
  const row = db
    .prepare("SELECT COALESCE(SUM(total_price), 0) as total FROM line_items WHERE purchase_order_id = ?")
    .get(poId) as { total: number };

  db.prepare("UPDATE purchase_orders SET total_amount = ?, updated_at = ? WHERE id = ?").run(
    row.total,
    new Date().toISOString(),
    poId,
  );
}
