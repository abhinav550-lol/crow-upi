const asyncHandler = require("../../utils/asyncHandler");
const chatService = require("./chat.service");

exports.sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const msg = await chatService.sendMessage(req.params.disputeId, req.user.id, message);
  res.status(201).json({ success: true, message: msg });
});

exports.getMessages = asyncHandler(async (req, res) => {
  const messages = await chatService.getMessages(req.params.disputeId);
  res.json({ success: true, messages });
});
