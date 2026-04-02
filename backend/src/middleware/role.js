const AppError = require("../utils/appError");

/**
 * Restrict access to specific roles.
 * Usage: authorize("BUYER") or authorize("SELLER", "MODERATOR")
 */
const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

module.exports = authorize;
