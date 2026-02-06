import { getDatabase } from "../config/database.js";

export function generatePoNumber(): string {
  const db = getDatabase();
  const year = new Date().getFullYear();
  const prefix = `EPO-${year}-`;

  const row = db
    .prepare(
      `SELECT po_number FROM purchase_orders
       WHERE po_number LIKE ?
       ORDER BY po_number DESC LIMIT 1`,
    )
    .get(`${prefix}%`) as { po_number: string } | undefined;

  let nextNum = 1;
  if (row) {
    const lastNum = parseInt(row.po_number.replace(prefix, ""), 10);
    nextNum = lastNum + 1;
  }

  return `${prefix}${String(nextNum).padStart(4, "0")}`;
}
