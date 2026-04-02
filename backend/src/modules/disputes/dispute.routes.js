const router = require("express").Router();
const protect = require("../../middleware/auth");
const authorize = require("../../middleware/role");
const ctrl = require("./dispute.controller");

router.use(protect);

router.post("/:orderId", authorize("BUYER"), ctrl.raise);
router.get("/", authorize("MODERATOR"), ctrl.getAll);
router.get("/:id", ctrl.getById);
router.patch("/:id/resolve-seller", authorize("MODERATOR"), ctrl.resolveForSeller);
router.patch("/:id/resolve-buyer", authorize("MODERATOR"), ctrl.resolveForBuyer);

module.exports = router;
