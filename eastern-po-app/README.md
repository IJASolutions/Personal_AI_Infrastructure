# Eastern PO App

Purchase Order management application for Eastern operations. Handles creation, tracking, approval workflows, and reporting of purchase orders.

## Features

- **Purchase Order CRUD** — Create, read, update, and delete purchase orders
- **Line Item Management** — Add/remove items with quantities, unit prices, and descriptions
- **Vendor Management** — Track vendor information and link to purchase orders
- **Status Workflow** — Draft → Submitted → Approved → Received → Closed
- **Search & Filter** — Find POs by number, vendor, status, or date range

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **Database**: SQLite (via better-sqlite3)
- **Validation**: Zod
- **Testing**: Vitest

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Run database migrations
npm run db:migrate

# Seed sample data (optional)
npm run db:seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Purchase Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/purchase-orders` | List all POs (with filters) |
| GET | `/api/purchase-orders/:id` | Get PO by ID |
| POST | `/api/purchase-orders` | Create new PO |
| PUT | `/api/purchase-orders/:id` | Update PO |
| PATCH | `/api/purchase-orders/:id/status` | Update PO status |
| DELETE | `/api/purchase-orders/:id` | Delete PO |

### Vendors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vendors` | List all vendors |
| GET | `/api/vendors/:id` | Get vendor by ID |
| POST | `/api/vendors` | Create vendor |
| PUT | `/api/vendors/:id` | Update vendor |
| DELETE | `/api/vendors/:id` | Delete vendor |

### Line Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/purchase-orders/:poId/items` | List items for a PO |
| POST | `/api/purchase-orders/:poId/items` | Add item to PO |
| PUT | `/api/purchase-orders/:poId/items/:id` | Update line item |
| DELETE | `/api/purchase-orders/:poId/items/:id` | Remove line item |

## Project Structure

```
eastern-po-app/
├── src/
│   ├── server.ts           # Application entry point
│   ├── app.ts              # Express app setup
│   ├── config/
│   │   ├── database.ts     # SQLite connection
│   │   ├── migrate.ts      # Database migrations
│   │   └── seed.ts         # Sample data seeder
│   ├── models/
│   │   ├── purchaseOrder.ts
│   │   ├── lineItem.ts
│   │   └── vendor.ts
│   ├── routes/
│   │   ├── purchaseOrders.ts
│   │   ├── vendors.ts
│   │   └── lineItems.ts
│   ├── controllers/
│   │   ├── purchaseOrderController.ts
│   │   ├── vendorController.ts
│   │   └── lineItemController.ts
│   ├── services/
│   │   ├── purchaseOrderService.ts
│   │   ├── vendorService.ts
│   │   └── lineItemService.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   └── utils/
│       └── poNumberGenerator.ts
├── tests/
├── docs/
├── package.json
├── tsconfig.json
└── .env.example
```

## License

MIT
