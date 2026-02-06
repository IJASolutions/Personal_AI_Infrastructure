import type { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler.js";
import * as lineItemService from "../services/lineItemService.js";
import * as poService from "../services/purchaseOrderService.js";

export function listLineItems(req: Request, res: Response, next: NextFunction): void {
  try {
    const po = poService.getPurchaseOrderById(req.params.poId);
    if (!po) throw new AppError(404, "Purchase order not found");
    const items = lineItemService.getLineItems(req.params.poId);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export function createLineItem(req: Request, res: Response, next: NextFunction): void {
  try {
    const po = poService.getPurchaseOrderById(req.params.poId);
    if (!po) throw new AppError(404, "Purchase order not found");
    const item = lineItemService.createLineItem(req.params.poId, req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export function updateLineItem(req: Request, res: Response, next: NextFunction): void {
  try {
    const item = lineItemService.updateLineItem(req.params.id, req.body);
    if (!item) throw new AppError(404, "Line item not found");
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export function deleteLineItem(req: Request, res: Response, next: NextFunction): void {
  try {
    const deleted = lineItemService.deleteLineItem(req.params.id);
    if (!deleted) throw new AppError(404, "Line item not found");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
