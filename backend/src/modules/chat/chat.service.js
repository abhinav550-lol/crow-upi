const prisma = require("../../config/prisma");
const AppError = require("../../utils/appError");

/**
 * Send a message in a dispute chat.
 * Allowed: buyer, seller (of the order), or moderator.
 */
const sendMessage = async (disputeId, senderId, message) => {
  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: { order: true },
  });

  if (!dispute) throw new AppError("Dispute not found", 404);

  // Verify sender is a participant
  const isParticipant =
    senderId === dispute.order.buyerId ||
    senderId === dispute.order.sellerId ||
    senderId === dispute.moderatorId;

  // Also allow any moderator to join
  const sender = await prisma.user.findUnique({ where: { id: senderId } });
  if (!isParticipant && sender.role !== "MODERATOR") {
    throw new AppError("Not authorized to participate in this chat", 403);
  }

  // If moderator is chatting and hasn't been assigned, assign them
  if (sender.role === "MODERATOR" && !dispute.moderatorId) {
    await prisma.dispute.update({
      where: { id: disputeId },
      data: { moderatorId: senderId },
    });
  }

  return prisma.chatMessage.create({
    data: { disputeId, senderId, message },
    include: { sender: { select: { id: true, name: true, role: true } } },
  });
};

/**
 * Get all messages for a dispute.
 */
const getMessages = async (disputeId) => {
  const dispute = await prisma.dispute.findUnique({ where: { id: disputeId } });
  if (!dispute) throw new AppError("Dispute not found", 404);

  return prisma.chatMessage.findMany({
    where: { disputeId },
    include: { sender: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: "asc" },
  });
};

module.exports = { sendMessage, getMessages };
