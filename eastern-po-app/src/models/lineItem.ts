import { z } from "zod";

export const createLineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
  unit_price: z.number().nonnegative("Unit price must be non-negative"),
});

export const updateLineItemSchema = createLineItemSchema.partial();

export type CreateLineItemInput = z.infer<typeof createLineItemSchema>;
export type UpdateLineItemInput = z.infer<typeof updateLineItemSchema>;

export interface LineItem {
  id: string;
  purchase_order_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}
