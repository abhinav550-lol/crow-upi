const prisma = require("../../config/prisma");
const AppError = require("../../utils/appError");

/**
 * Get wallet for the authenticated user.
 */
const getMyWallet = async (userId) => {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });
  if (!wallet) throw new AppError("Wallet not found", 404);
  return wallet;
};

/**
 * Add dummy money to buyer's wallet.
 */
const addMoney = async (userId, amount) => {
  if (!amount || amount <= 0) {
    throw new AppError("Amount must be greater than 0", 400);
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new AppError("Wallet not found", 404);

  const updated = await prisma.$transaction(async (tx) => {
    const w = await tx.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: w.id,
        type: "CREDIT",
        amount,
        description: `Dummy recharge of ₹${amount}`,
      },
    });

    return w;
  });

  return updated;
};

/**
 * Get wallet transaction history.
 */
const getTransactions = async (userId) => {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new AppError("Wallet not found", 404);

  return prisma.walletTransaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: "desc" },
  });
};

module.exports = { getMyWallet, addMoney, getTransactions };
