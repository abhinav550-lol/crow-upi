const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const prisma = require("./config/prisma");
const { startEscrowWorker } = require("./modules/escrow/escrow.worker");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✅  Server running on http://localhost:${PORT}`);
  console.log(`📦  Environment: ${process.env.NODE_ENV || "development"}\n`);

  // Start the escrow auto-release background worker
  startEscrowWorker();
});

// Graceful shutdown
const shutdown = async () => {
  console.log("\n🔌  Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
