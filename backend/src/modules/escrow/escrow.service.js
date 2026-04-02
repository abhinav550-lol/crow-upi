const prisma = require("../../config/prisma");

/**
 * Release escrowed funds to seller's wallet.
 * Used by auto-release worker and moderator resolve-for-seller.
 */
const releaseToSeller = async (escrowId) => {
  const escrow = await prisma.escrow.findUnique({
    where: { id: escrowId },
    include: { order: true },
  });

  if (!escrow || escrow.status !== "LOCKED") return null;

  return prisma.$transaction(async (tx) => {
    // 1. Credit seller wallet
    const sellerWallet = await tx.wallet.findUnique({
      where: { userId: escrow.order.sellerId },
    });

    await tx.wallet.update({
      where: { userId: escrow.order.sellerId },
      data: { balance: { increment: escrow.amount } },
    });

    // 2. Log seller transaction
    await tx.walletTransaction.create({
      data: {
        walletId: sellerWallet.id,
        type: "ESCROW_RELEASE",
        amount: escrow.amount,
        description: `Payment received for order`,
        referenceId: escrow.orderId,
      },
    });

    // 3. Update escrow
    await tx.escrow.update({
      where: { id: escrowId },
      data: { status: "RELEASED", releasedAt: new Date() },
    });

    // 4. Update order
    await tx.order.update({
      where: { id: escrow.orderId },
      data: { status: "RELEASED" },
    });

    return true;
  });
};

/**
 * Refund escrowed funds back to buyer's wallet.
 * Used by moderator resolve-for-buyer.
 */
const refundToBuyer = async (escrowId) => {
  const escrow = await prisma.escrow.findUnique({
    where: { id: escrowId },
    include: { order: true },
  });

  if (!escrow || (escrow.status !== "FROZEN" && escrow.status !== "LOCKED")) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    // 1. Credit buyer wallet
    const buyerWallet = await tx.wallet.findUnique({
      where: { userId: escrow.buyerId },
    });

    await tx.wallet.update({
      where: { userId: escrow.buyerId },
      data: { balance: { increment: escrow.amount } },
    });

    // 2. Log buyer refund transaction
    await tx.walletTransaction.create({
      data: {
        walletId: buyerWallet.id,
        type: "REFUND",
        amount: escrow.amount,
        description: `Refund for disputed order`,
        referenceId: escrow.orderId,
      },
    });

    // 3. Update escrow
    await tx.escrow.update({
      where: { id: escrowId },
      data: { status: "REFUNDED", refundedAt: new Date() },
    });

    // 4. Update order
    await tx.order.update({
      where: { id: escrow.orderId },
      data: { status: "REFUNDED", disputed: false },
    });

    return true;
  });
};

/**
 * Freeze an escrow (called when dispute is raised).
 */
const freezeEscrow = async (orderId) => {
  return prisma.escrow.update({
    where: { orderId },
    data: { status: "FROZEN" },
  });
};

module.exports = { releaseToSeller, refundToBuyer, freezeEscrow };
