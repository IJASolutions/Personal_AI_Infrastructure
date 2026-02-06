import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createVendorSchema, updateVendorSchema } from "../models/vendor.js";
import * as ctrl from "../controllers/vendorController.js";

const router = Router();

router.get("/", ctrl.listVendors);
router.get("/:id", ctrl.getVendor);
router.post("/", validate(createVendorSchema), ctrl.createVendor);
router.put("/:id", validate(updateVendorSchema), ctrl.updateVendor);
router.delete("/:id", ctrl.deleteVendor);

export { router as vendorRoutes };
