const asyncHandler = require("../../utils/asyncHandler");
const disputeService = require("./dispute.service");

exports.raise = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const dispute = await disputeService.raiseDispute(req.params.orderId, req.user.id, reason);
  res.status(201).json({ success: true, dispute });
});

exports.getAll = asyncHandler(async (_req, res) => {
  const disputes = await disputeService.getAllDisputes();
  res.json({ success: true, disputes });
});

exports.getById = asyncHandler(async (req, res) => {
  const dispute = await disputeService.getDisputeById(req.params.id);
  res.json({ success: true, dispute });
});

exports.resolveForSeller = asyncHandler(async (req, res) => {
  const result = await disputeService.resolveForSeller(req.params.id, req.user.id);
  res.json({ success: true, ...result });
});

exports.resolveForBuyer = asyncHandler(async (req, res) => {
  const result = await disputeService.resolveForBuyer(req.params.id, req.user.id);
  res.json({ success: true, ...result });
});
