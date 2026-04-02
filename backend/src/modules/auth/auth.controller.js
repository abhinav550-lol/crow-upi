const asyncHandler = require("../../utils/asyncHandler");
const authService = require("./auth.service");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const { user, token } = await authService.register({ name, email, password, role });

  res.status(201).cookie("token", token, COOKIE_OPTIONS).json({
    success: true,
    token,
    user,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });

  res.status(200).cookie("token", token, COOKIE_OPTIONS).json({
    success: true,
    token,
    user,
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.status(200).json({ success: true, user });
});

exports.logout = asyncHandler(async (_req, res) => {
  res.cookie("token", "none", {
    httpOnly: true,
    expires: new Date(Date.now() + 5000),
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});
