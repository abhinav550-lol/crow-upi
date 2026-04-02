const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const AppError = require("../utils/appError");

/**
 * Verify JWT from Authorization header or cookie.
 * Attaches `req.user` with id, name, email, role.
 */
const protect = async (req, _res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError("Not authorized – no token provided", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    req.user = user;
    next();
  } catch {
    return next(new AppError("Not authorized – token invalid", 401));
  }
};

module.exports = protect;
