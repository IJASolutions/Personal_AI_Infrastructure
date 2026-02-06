import type { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler.js";
import * as poService from "../services/purchaseOrderService.js";

export function listPurchaseOrders(req: Request, res: Response, next: NextFunction): void {
  try {
    const filters: poService.PoFilters = {
      status: req.query.status as string | undefined,
      vendor_id: req.query.vendor_id as string | undefined,
      from_date: req.query.from_date as string | undefined,
      to_date: req.query.to_date as string | undefined,
      search: req.query.search as string | undefined,
    };
    const orders = poService.getAllPurchaseOrders(filters);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export function getPurchaseOrder(req: Request, res: Response, next: NextFunction): void {
  try {
    const order = poService.getPurchaseOrderById(req.params.id);
    if (!order) throw new AppError(404, "Purchase order not found");
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export function createPurchaseOrder(req: Request, res: Response, next: NextFunction): void {
  try {
    const order = poService.createPurchaseOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export function updatePurchaseOrder(req: Request, res: Response, next: NextFunction): void {
  try {
    const order = poService.updatePurchaseOrder(req.params.id, req.body);
    if (!order) throw new AppError(404, "Purchase order not found");
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export function updateStatus(req: Request, res: Response, next: NextFunction): void {
  try {
    const order = poService.updatePurchaseOrderStatus(req.params.id, req.body.status);
    if (!order) throw new AppError(404, "Purchase order not found");
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export function deletePurchaseOrder(req: Request, res: Response, next: NextFunction): void {
  try {
    const deleted = poService.deletePurchaseOrder(req.params.id);
    if (!deleted) throw new AppError(404, "Purchase order not found");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
