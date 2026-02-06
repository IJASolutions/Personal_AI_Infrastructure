import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createLineItemSchema, updateLineItemSchema } from "../models/lineItem.js";
import * as ctrl from "../controllers/lineItemController.js";

const router = Router();

router.get("/:poId/items", ctrl.listLineItems);
router.post("/:poId/items", validate(createLineItemSchema), ctrl.createLineItem);
router.put("/:poId/items/:id", validate(updateLineItemSchema), ctrl.updateLineItem);
router.delete("/:poId/items/:id", ctrl.deleteLineItem);

export { router as lineItemRoutes };
