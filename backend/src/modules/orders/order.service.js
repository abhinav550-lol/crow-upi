const prisma = require("../../config/prisma");
const AppError = require("../../utils/appError");

const ESCROW_DURATION_SECONDS = 48;

/**
 * Place an order — atomic: debit buyer wallet, create order + escrow, log transaction.
 */
const placeOrder = async (buyerId, productId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw new AppError("Product not found or inactive", 404);

  if (product.sellerId === buyerId) {
    throw new AppError("You cannot buy your own product", 400);
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId: buyerId } });
  if (!wallet) throw new AppError("Wallet not found", 404);
  if (wallet.balance < product.price) {
    throw new AppError("Insufficient wallet balance", 400);
  }

  const releaseAt = new Date(Date.now() + ESCROW_DURATION_SECONDS * 1000);

  const result = await prisma.$transaction(async (tx) => {
    // 1. Debit buyer wallet
    await tx.wallet.update({
      where: { userId: buyerId },
      data: { balance: { decrement: product.price } },
    });

    // 2. Create order
    const order = await tx.order.create({
      data: {
        buyerId,
        sellerId: product.sellerId,
        productId: product.id,
        amount: product.price,
        status: "ESCROWED",
        autoReleaseAt: releaseAt,
      },
    });

    // 3. Create escrow
    await tx.escrow.create({
      data: {
        orderId: order.id,
        buyerId,
        amount: product.price,
        status: "LOCKED",
        releaseAt,
      },
    });

    // 4. Log wallet transaction
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "ESCROW_LOCK",
        amount: product.price,
        description: `Escrow lock for order on "${product.name}"`,
        referenceId: order.id,
      },
    });

    return order;
  });

  return result;
};

/**
 * Get orders for a buyer.
 */
const getBuyerOrders = async (buyerId) => {
  return prisma.order.findMany({
    where: { buyerId },
    include: {
      product: true,
      seller: { select: { id: true, name: true } },
      escrow: true,
      dispute: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get orders for a seller.
 */
const getSellerOrders = async (sellerId) => {
  return prisma.order.findMany({
    where: { sellerId },
    include: {
      product: true,
      buyer: { select: { id: true, name: true } },
      escrow: true,
      dispute: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get a single order by ID (with access check).
 */
const getOrderById = async (orderId, userId, userRole) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      product: true,
      buyer: { select: { id: true, name: true, email: true } },
      seller: { select: { id: true, name: true, email: true } },
      escrow: true,
      dispute: { include: { messages: true } },
    },
  });
  if (!order) throw new AppError("Order not found", 404);

  // Moderators can see all orders; buyers/sellers can only see their own
  if (userRole !== "MODERATOR" && order.buyerId !== userId && order.sellerId !== userId) {
    throw new AppError("Not authorized to view this order", 403);
  }

  return order;
};

module.exports = { placeOrder, getBuyerOrders, getSellerOrders, getOrderById };
