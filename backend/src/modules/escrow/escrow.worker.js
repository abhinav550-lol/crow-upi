const prisma = require("../../config/prisma");
const escrowService = require("./escrow.service");

const POLL_INTERVAL_MS = 5000; // Check every 5 seconds

/**
 * Poll for LOCKED escrows whose releaseAt has passed.
 * Auto-release funds to seller if no dispute was raised.
 */
const startEscrowWorker = () => {
  console.log("⏱️  Escrow auto-release worker started (polling every 5s)");

  setInterval(async () => {
    try {
      const dueEscrows = await prisma.escrow.findMany({
        where: {
          status: "LOCKED",
          releaseAt: { lte: new Date() },
        },
        include: { order: true },
      });

      for (const escrow of dueEscrows) {
        // Skip if order was disputed in the meantime
        if (escrow.order.disputed) continue;

        try {
          await escrowService.releaseToSeller(escrow.id);
          console.log(`✅  Auto-released escrow ${escrow.id} → seller paid`);
        } catch (err) {
          console.error(`❌  Failed to auto-release escrow ${escrow.id}:`, err.message);
        }
      }
    } catch (err) {
      console.error("❌  Escrow worker error:", err.message);
    }
  }, POLL_INTERVAL_MS);
};

module.exports = { startEscrowWorker };
