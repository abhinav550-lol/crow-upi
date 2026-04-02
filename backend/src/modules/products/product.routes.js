const router = require("express").Router();
const protect = require("../../middleware/auth");
const authorize = require("../../middleware/role");
const ctrl = require("./product.controller");

router.get("/", ctrl.getAll);                          // Public browse

router.use(protect);                                   // Below = auth required
router.get("/seller/mine", authorize("SELLER"), ctrl.getMine);
router.post("/", authorize("SELLER"), ctrl.create);
router.patch("/:id", authorize("SELLER"), ctrl.update);
router.delete("/:id", authorize("SELLER"), ctrl.remove);
router.get("/:id", ctrl.getById);                      // Must be last (wildcard)

module.exports = router;
