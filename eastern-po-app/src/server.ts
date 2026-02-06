import { app } from "./app.js";
import { closeDatabase } from "./config/database.js";

const PORT = parseInt(process.env.PORT || "3000", 10);

const server = app.listen(PORT, () => {
  console.log(`Eastern PO App running on http://localhost:${PORT}`);
});

function shutdown(): void {
  console.log("\nShutting down gracefully...");
  server.close(() => {
    closeDatabase();
    console.log("Server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
