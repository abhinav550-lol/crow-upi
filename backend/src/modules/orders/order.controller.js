const asyncHandler = require("../../utils/asyncHandler");
const orderService = require("./order.service");

exports.placeOrder = asyncHandler(async (req, res) => {
  const order = await orderService.placeOrder(req.user.id, req.params.productId);
  res.status(201).json({ success: true, order });
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getBuyerOrders(req.user.id);
  res.json({ success: true, orders });
});

exports.getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getSellerOrders(req.user.id);
  res.json({ success: true, orders });
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.role);
  res.json({ success: true, order });
});
