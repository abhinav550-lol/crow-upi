const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/prisma");
const AppError = require("../../utils/appError");

const SALT_ROUNDS = 12;

/**
 * Generate a JWT for the given user id.
 */
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

/**
 * Register a new user and create their wallet.
 */
const register = async ({ name, email, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError("Email is already registered", 400);

  const validRoles = ["BUYER", "SELLER", "MODERATOR"];
  if (!validRoles.includes(role)) {
    throw new AppError("Invalid role. Must be BUYER, SELLER, or MODERATOR", 400);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user + wallet atomically
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      wallet: { create: { balance: 0 } },
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const token = generateToken(user.id);
  return { user, token };
};

/**
 * Login with email + password.
 */
const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const token = generateToken(user.id);

  const { passwordHash: _, ...safeUser } = user;
  return { user: safeUser, token };
};

/**
 * Get the currently authenticated user.
 */
const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) throw new AppError("User not found", 404);
  return user;
};

module.exports = { register, login, getMe };
