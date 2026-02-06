import { getDatabase, closeDatabase } from "./database.js";
import { v4 as uuidv4 } from "uuid";

function seed(): void {
  const db = getDatabase();

  const vendorIds = [uuidv4(), uuidv4(), uuidv4()];

  const insertVendor = db.prepare(`
    INSERT OR IGNORE INTO vendors (id, name, contact_name, email, phone, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const vendors = [
    [vendorIds[0], "Eastern Supply Co.", "Jane Chen", "jane@easternsupply.com", "555-0101", "123 Main St, Springfield"],
    [vendorIds[1], "Pacific Materials Ltd.", "Bob Kim", "bob@pacificmaterials.com", "555-0202", "456 Oak Ave, Portland"],
    [vendorIds[2], "Summit Industrial", "Maria Lopez", "maria@summitind.com", "555-0303", "789 Pine Rd, Seattle"],
  ];

  const insertPO = db.prepare(`
    INSERT OR IGNORE INTO purchase_orders (id, po_number, vendor_id, status, order_date, expected_delivery_date, notes, total_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const poIds = [uuidv4(), uuidv4()];

  const purchaseOrders = [
    [poIds[0], "EPO-2026-0001", vendorIds[0], "submitted", "2026-02-01", "2026-02-15", "Urgent office supplies order", 1250.00],
    [poIds[1], "EPO-2026-0002", vendorIds[1], "draft", "2026-02-05", "2026-03-01", "Monthly raw materials", 8750.50],
  ];

  const insertItem = db.prepare(`
    INSERT OR IGNORE INTO line_items (id, purchase_order_id, description, quantity, unit_price, total_price)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const lineItems = [
    [uuidv4(), poIds[0], "Printer Paper (500 sheets)", 10, 25.00, 250.00],
    [uuidv4(), poIds[0], "Ink Cartridges", 5, 200.00, 1000.00],
    [uuidv4(), poIds[1], "Steel Rods (1m)", 50, 125.00, 6250.00],
    [uuidv4(), poIds[1], "Copper Wire (100ft)", 10, 250.05, 2500.50],
  ];

  const transaction = db.transaction(() => {
    for (const v of vendors) insertVendor.run(...v);
    for (const po of purchaseOrders) insertPO.run(...po);
    for (const li of lineItems) insertItem.run(...li);
  });

  transaction();

  console.log("Seed data inserted successfully.");
  console.log(`  - ${vendors.length} vendors`);
  console.log(`  - ${purchaseOrders.length} purchase orders`);
  console.log(`  - ${lineItems.length} line items`);

  closeDatabase();
}

seed();
