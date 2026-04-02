const router = require("express").Router();
const protect = require("../../middleware/auth");
const authorize = require("../../middleware/role");
const ctrl = require("./order.controller");

router.use(protect);

router.post("/:productId", authorize("BUYER"), ctrl.placeOrder);
router.get("/my-orders", authorize("BUYER"), ctrl.getMyOrders);
router.get("/seller-orders", authorize("SELLER"), ctrl.getSellerOrders);
router.get("/:id", ctrl.getOrderById);

module.exports = router;
