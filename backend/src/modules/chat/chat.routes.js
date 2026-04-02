const router = require("express").Router();
const protect = require("../../middleware/auth");
const ctrl = require("./chat.controller");

router.use(protect);

router.post("/:disputeId/messages", ctrl.sendMessage);
router.get("/:disputeId/messages", ctrl.getMessages);

module.exports = router;
