const asyncHandler = require("../../utils/asyncHandler");
const walletService = require("./wallet.service");

exports.getMyWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.getMyWallet(req.user.id);
  res.json({ success: true, wallet });
});

exports.addMoney = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const wallet = await walletService.addMoney(req.user.id, Number(amount));
  res.json({ success: true, message: `₹${amount} added`, wallet });
});

exports.getTransactions = asyncHandler(async (req, res) => {
  const transactions = await walletService.getTransactions(req.user.id);
  res.json({ success: true, transactions });
});
