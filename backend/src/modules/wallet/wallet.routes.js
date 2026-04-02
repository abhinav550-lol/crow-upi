const router = require("express").Router();
const protect = require("../../middleware/auth");
const authorize = require("../../middleware/role");
const { getMyWallet, addMoney, getTransactions } = require("./wallet.controller");

router.use(protect); // All wallet routes are protected

router.get("/me", getMyWallet);
router.post("/add-money", authorize("BUYER"), addMoney);
router.get("/transactions", getTransactions);

module.exports = router;
