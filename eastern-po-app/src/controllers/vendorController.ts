import type { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler.js";
import * as vendorService from "../services/vendorService.js";

export function listVendors(_req: Request, res: Response, next: NextFunction): void {
  try {
    const vendors = vendorService.getAllVendors();
    res.json(vendors);
  } catch (err) {
    next(err);
  }
}

export function getVendor(req: Request, res: Response, next: NextFunction): void {
  try {
    const vendor = vendorService.getVendorById(req.params.id);
    if (!vendor) throw new AppError(404, "Vendor not found");
    res.json(vendor);
  } catch (err) {
    next(err);
  }
}

export function createVendor(req: Request, res: Response, next: NextFunction): void {
  try {
    const vendor = vendorService.createVendor(req.body);
    res.status(201).json(vendor);
  } catch (err) {
    next(err);
  }
}

export function updateVendor(req: Request, res: Response, next: NextFunction): void {
  try {
    const vendor = vendorService.updateVendor(req.params.id, req.body);
    if (!vendor) throw new AppError(404, "Vendor not found");
    res.json(vendor);
  } catch (err) {
    next(err);
  }
}

export function deleteVendor(req: Request, res: Response, next: NextFunction): void {
  try {
    const deleted = vendorService.deleteVendor(req.params.id);
    if (!deleted) throw new AppError(404, "Vendor not found");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
