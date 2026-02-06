import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createPurchaseOrderSchema, updatePurchaseOrderSchema, updateStatusSchema } from "../models/purchaseOrder.js";
import * as ctrl from "../controllers/purchaseOrderController.js";

const router = Router();

router.get("/", ctrl.listPurchaseOrders);
router.get("/:id", ctrl.getPurchaseOrder);
router.post("/", validate(createPurchaseOrderSchema), ctrl.createPurchaseOrder);
router.put("/:id", validate(updatePurchaseOrderSchema), ctrl.updatePurchaseOrder);
router.patch("/:id/status", validate(updateStatusSchema), ctrl.updateStatus);
router.delete("/:id", ctrl.deletePurchaseOrder);

export { router as purchaseOrderRoutes };
