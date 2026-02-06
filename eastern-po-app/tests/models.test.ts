import { describe, it, expect } from "vitest";
import { createVendorSchema } from "../src/models/vendor.js";
import { createPurchaseOrderSchema } from "../src/models/purchaseOrder.js";
import { createLineItemSchema } from "../src/models/lineItem.js";

describe("Vendor schema", () => {
  it("accepts valid vendor input", () => {
    const result = createVendorSchema.safeParse({
      name: "Test Vendor",
      email: "test@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = createVendorSchema.safeParse({
      email: "test@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = createVendorSchema.safeParse({
      name: "Test Vendor",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });
});

describe("PurchaseOrder schema", () => {
  it("accepts valid PO input", () => {
    const result = createPurchaseOrderSchema.safeParse({
      vendor_id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid vendor_id", () => {
    const result = createPurchaseOrderSchema.safeParse({
      vendor_id: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });
});

describe("LineItem schema", () => {
  it("accepts valid line item input", () => {
    const result = createLineItemSchema.safeParse({
      description: "Widget",
      quantity: 10,
      unit_price: 5.99,
    });
    expect(result.success).toBe(true);
  });

  it("rejects zero quantity", () => {
    const result = createLineItemSchema.safeParse({
      description: "Widget",
      quantity: 0,
      unit_price: 5.99,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative unit price", () => {
    const result = createLineItemSchema.safeParse({
      description: "Widget",
      quantity: 10,
      unit_price: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty description", () => {
    const result = createLineItemSchema.safeParse({
      description: "",
      quantity: 10,
      unit_price: 5.99,
    });
    expect(result.success).toBe(false);
  });
});
