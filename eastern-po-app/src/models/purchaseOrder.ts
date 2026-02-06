import { z } from "zod";

export const PO_STATUSES = ["draft", "submitted", "approved", "received", "closed", "cancelled"] as const;
export type PoStatus = (typeof PO_STATUSES)[number];

export const createPurchaseOrderSchema = z.object({
  vendor_id: z.string().uuid("Invalid vendor ID"),
  order_date: z.string().optional(),
  expected_delivery_date: z.string().optional(),
  notes: z.string().optional(),
});

export const updatePurchaseOrderSchema = createPurchaseOrderSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(PO_STATUSES),
});

export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>;
export type UpdatePurchaseOrderInput = z.infer<typeof updatePurchaseOrderSchema>;

export interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id: string;
  status: PoStatus;
  order_date: string;
  expected_delivery_date: string | null;
  notes: string | null;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderWithVendor extends PurchaseOrder {
  vendor_name: string;
}
