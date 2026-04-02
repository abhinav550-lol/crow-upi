const router = require("express").Router();
const protect = require("../../middleware/auth");
const { register, login, getMe, logout } = require("./auth.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
