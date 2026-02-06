import { getDatabase } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import { recalculateTotal } from "./purchaseOrderService.js";
import type { LineItem, CreateLineItemInput, UpdateLineItemInput } from "../models/lineItem.js";

export function getLineItems(purchaseOrderId: string): LineItem[] {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM line_items WHERE purchase_order_id = ? ORDER BY created_at")
    .all(purchaseOrderId) as LineItem[];
}

export function getLineItemById(id: string): LineItem | undefined {
  const db = getDatabase();
  return db.prepare("SELECT * FROM line_items WHERE id = ?").get(id) as LineItem | undefined;
}

export function createLineItem(purchaseOrderId: string, input: CreateLineItemInput): LineItem {
  const db = getDatabase();
  const id = uuidv4();
  const totalPrice = input.quantity * input.unit_price;
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO line_items (id, purchase_order_id, description, quantity, unit_price, total_price, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(id, purchaseOrderId, input.description, input.quantity, input.unit_price, totalPrice, now, now);

  recalculateTotal(purchaseOrderId);
  return getLineItemById(id)!;
}

export function updateLineItem(id: string, input: UpdateLineItemInput): LineItem | undefined {
  const db = getDatabase();
  const existing = getLineItemById(id);
  if (!existing) return undefined;

  const quantity = input.quantity ?? existing.quantity;
  const unitPrice = input.unit_price ?? existing.unit_price;
  const description = input.description ?? existing.description;
  const totalPrice = quantity * unitPrice;

  db.prepare(
    `UPDATE line_items SET description = ?, quantity = ?, unit_price = ?, total_price = ?, updated_at = ?
     WHERE id = ?`,
  ).run(description, quantity, unitPrice, totalPrice, new Date().toISOString(), id);

  recalculateTotal(existing.purchase_order_id);
  return getLineItemById(id)!;
}

export function deleteLineItem(id: string): boolean {
  const db = getDatabase();
  const existing = getLineItemById(id);
  if (!existing) return false;

  const result = db.prepare("DELETE FROM line_items WHERE id = ?").run(id);
  if (result.changes > 0) {
    recalculateTotal(existing.purchase_order_id);
    return true;
  }
  return false;
}
