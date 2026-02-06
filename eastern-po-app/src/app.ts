import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";
import { purchaseOrderRoutes } from "./routes/purchaseOrders.js";
import { vendorRoutes } from "./routes/vendors.js";
import { lineItemRoutes } from "./routes/lineItems.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "eastern-po-app", timestamp: new Date().toISOString() });
});

app.use("/api/vendors", vendorRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/purchase-orders", lineItemRoutes);

app.use(errorHandler);

export { app };
