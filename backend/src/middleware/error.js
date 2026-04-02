const errorHandler = (err, _req, res, _next) => {
  console.error("❌ Error:", err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Prisma unique constraint
  if (err.code === "P2002") {
    statusCode = 400;
    const field = err.meta?.target?.join(", ") || "field";
    message = `Duplicate value for: ${field}`;
  }

  // Prisma record not found
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  // Prisma validation
  if (err.name === "PrismaClientValidationError") {
    statusCode = 400;
    message = "Invalid data provided";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
