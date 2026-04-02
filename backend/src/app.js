const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const errorHandler = require("./middleware/error");

const app = express();

// ──────────────────────────────────────
//  Middleware
// ──────────────────────────────────────

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "crowupi-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// ──────────────────────────────────────
//  Health check
// ──────────────────────────────────────

app.get("/", (_req, res) => {
  res.json({ message: "🚀 CrowUPI API is running" });
});

// ──────────────────────────────────────
//  Routes
// ──────────────────────────────────────

app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/wallet", require("./modules/wallet/wallet.routes"));
app.use("/api/products", require("./modules/products/product.routes"));
app.use("/api/orders", require("./modules/orders/order.routes"));
app.use("/api/disputes", require("./modules/disputes/dispute.routes"));
app.use("/api/chat", require("./modules/chat/chat.routes"));

// ──────────────────────────────────────
//  Error handler (must be last)
// ──────────────────────────────────────

app.use(errorHandler);

module.exports = app;
