const prisma = require("../../config/prisma");
const AppError = require("../../utils/appError");
const escrowService = require("../escrow/escrow.service");

/**
 * Raise a dispute on an escrowed order (buyer only).
 */
const raiseDispute = async (orderId, buyerId, reason) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { escrow: true },
  });

  if (!order) throw new AppError("Order not found", 404);
  if (order.buyerId !== buyerId) throw new AppError("Not your order", 403);
  if (order.status !== "ESCROWED") {
    throw new AppError("Can only dispute escrowed orders", 400);
  }
  if (order.disputed) throw new AppError("Dispute already raised", 400);

  // Check timer hasn't already expired
  if (order.autoReleaseAt && new Date() >= order.autoReleaseAt) {
    throw new AppError("Escrow timer already expired — funds released", 400);
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Mark order as disputed
    await tx.order.update({
      where: { id: orderId },
      data: { status: "DISPUTED", disputed: true },
    });

    // 2. Freeze escrow
    await tx.escrow.update({
      where: { orderId },
      data: { status: "FROZEN" },
    });

    // 3. Create dispute record
    const dispute = await tx.dispute.create({
      data: {
        orderId,
        raisedById: buyerId,
        reason,
        status: "OPEN",
      },
    });

    return dispute;
  });

  return result;
};

/**
 * Get all disputes (moderator view).
 */
const getAllDisputes = async () => {
  return prisma.dispute.findMany({
    include: {
      order: {
        include: {
          product: true,
          buyer: { select: { id: true, name: true, email: true } },
          seller: { select: { id: true, name: true, email: true } },
          escrow: true,
        },
      },
      raisedBy: { select: { id: true, name: true } },
      moderator: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get a single dispute by ID.
 */
const getDisputeById = async (disputeId) => {
  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: {
      order: {
        include: {
          product: true,
          buyer: { select: { id: true, name: true, email: true } },
          seller: { select: { id: true, name: true, email: true } },
          escrow: true,
        },
      },
      raisedBy: { select: { id: true, name: true } },
      moderator: { select: { id: true, name: true } },
      messages: {
        include: { sender: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!dispute) throw new AppError("Dispute not found", 404);
  return dispute;
};

/**
 * Moderator resolves dispute in seller's favor — release funds to seller.
 */
const resolveForSeller = async (disputeId, moderatorId) => {
  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: { order: { include: { escrow: true } } },
  });

  if (!dispute) throw new AppError("Dispute not found", 404);
  if (dispute.status !== "OPEN") throw new AppError("Dispute already resolved", 400);

  const escrow = dispute.order.escrow;
  if (!escrow || escrow.status !== "FROZEN") {
    throw new AppError("Escrow not in frozen state", 400);
  }

  await prisma.$transaction(async (tx) => {
    // 1. Credit seller wallet
    const sellerWallet = await tx.wallet.findUnique({
      where: { userId: dispute.order.sellerId },
    });

    await tx.wallet.update({
      where: { userId: dispute.order.sellerId },
      data: { balance: { increment: escrow.amount } },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: sellerWallet.id,
        type: "ESCROW_RELEASE",
        amount: escrow.amount,
        description: "Dispute resolved in your favor",
        referenceId: dispute.orderId,
      },
    });

    // 2. Update escrow
    await tx.escrow.update({
      where: { id: escrow.id },
      data: { status: "RELEASED", releasedAt: new Date() },
    });

    // 3. Update order
    await tx.order.update({
      where: { id: dispute.orderId },
      data: { status: "RELEASED", disputed: false },
    });

    // 4. Close dispute
    await tx.dispute.update({
      where: { id: disputeId },
      data: {
        status: "RESOLVED_FOR_SELLER",
        moderatorId,
        resolvedAt: new Date(),
      },
    });
  });

  return { message: "Dispute resolved in seller's favor — funds released" };
};

/**
 * Moderator resolves dispute in buyer's favor — refund buyer.
 */
const resolveForBuyer = async (disputeId, moderatorId) => {
  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: { order: { include: { escrow: true } } },
  });

  if (!dispute) throw new AppError("Dispute not found", 404);
  if (dispute.status !== "OPEN") throw new AppError("Dispute already resolved", 400);

  const escrow = dispute.order.escrow;
  if (!escrow || escrow.status !== "FROZEN") {
    throw new AppError("Escrow not in frozen state", 400);
  }

  await prisma.$transaction(async (tx) => {
    // 1. Refund buyer wallet
    const buyerWallet = await tx.wallet.findUnique({
      where: { userId: escrow.buyerId },
    });

    await tx.wallet.update({
      where: { userId: escrow.buyerId },
      data: { balance: { increment: escrow.amount } },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: buyerWallet.id,
        type: "REFUND",
        amount: escrow.amount,
        description: "Dispute resolved in your favor — refunded",
        referenceId: dispute.orderId,
      },
    });

    // 2. Update escrow
    await tx.escrow.update({
      where: { id: escrow.id },
      data: { status: "REFUNDED", refundedAt: new Date() },
    });

    // 3. Update order
    await tx.order.update({
      where: { id: dispute.orderId },
      data: { status: "REFUNDED", disputed: false },
    });

    // 4. Close dispute
    await tx.dispute.update({
      where: { id: disputeId },
      data: {
        status: "RESOLVED_FOR_BUYER",
        moderatorId,
        resolvedAt: new Date(),
      },
    });
  });

  return { message: "Dispute resolved in buyer's favor — funds refunded" };
};

module.exports = {
  raiseDispute,
  getAllDisputes,
  getDisputeById,
  resolveForSeller,
  resolveForBuyer,
};
