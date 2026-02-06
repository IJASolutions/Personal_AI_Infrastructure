import { getDatabase } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import type { Vendor, CreateVendorInput, UpdateVendorInput } from "../models/vendor.js";

export function getAllVendors(): Vendor[] {
  const db = getDatabase();
  return db.prepare("SELECT * FROM vendors ORDER BY name").all() as Vendor[];
}

export function getVendorById(id: string): Vendor | undefined {
  const db = getDatabase();
  return db.prepare("SELECT * FROM vendors WHERE id = ?").get(id) as Vendor | undefined;
}

export function createVendor(input: CreateVendorInput): Vendor {
  const db = getDatabase();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO vendors (id, name, contact_name, email, phone, address, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(id, input.name, input.contact_name ?? null, input.email ?? null, input.phone ?? null, input.address ?? null, now, now);

  return getVendorById(id)!;
}

export function updateVendor(id: string, input: UpdateVendorInput): Vendor | undefined {
  const db = getDatabase();
  const existing = getVendorById(id);
  if (!existing) return undefined;

  const updated = { ...existing, ...input, updated_at: new Date().toISOString() };

  db.prepare(
    `UPDATE vendors SET name = ?, contact_name = ?, email = ?, phone = ?, address = ?, updated_at = ?
     WHERE id = ?`,
  ).run(updated.name, updated.contact_name, updated.email, updated.phone, updated.address, updated.updated_at, id);

  return getVendorById(id)!;
}

export function deleteVendor(id: string): boolean {
  const db = getDatabase();
  const result = db.prepare("DELETE FROM vendors WHERE id = ?").run(id);
  return result.changes > 0;
}
