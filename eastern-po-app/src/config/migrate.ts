import { getDatabase, closeDatabase } from "./database.js";

function migrate(): void {
  const db = getDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS vendors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      contact_name TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS purchase_orders (
      id TEXT PRIMARY KEY,
      po_number TEXT NOT NULL UNIQUE,
      vendor_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','submitted','approved','received','closed','cancelled')),
      order_date TEXT NOT NULL DEFAULT (date('now')),
      expected_delivery_date TEXT,
      notes TEXT,
      total_amount REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (vendor_id) REFERENCES vendors(id)
    );

    CREATE TABLE IF NOT EXISTS line_items (
      id TEXT PRIMARY KEY,
      purchase_order_id TEXT NOT NULL,
      description TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK(quantity > 0),
      unit_price REAL NOT NULL CHECK(unit_price >= 0),
      total_price REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_po_vendor ON purchase_orders(vendor_id);
    CREATE INDEX IF NOT EXISTS idx_po_status ON purchase_orders(status);
    CREATE INDEX IF NOT EXISTS idx_po_number ON purchase_orders(po_number);
    CREATE INDEX IF NOT EXISTS idx_li_po ON line_items(purchase_order_id);
  `);

  console.log("Database migrations completed successfully.");
  closeDatabase();
}

migrate();
