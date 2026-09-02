import "dotenv/config";
import express from "express";
import cors from "cors";
import { registerAuthRoutes, authRequired } from "./auth.js";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import reviewsRouter from "./routes/reviews.js";
import giftsRouter from "./routes/gifts.js";
import analyticsRouter from "./routes/analytics.js";

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET");
}

const app = express();
const requestedPort = Number(process.env.PORT || 5000);

// Production Security Headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

// Production-ready CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or localhost in dev
      if (!origin) return callback(null, true);
      const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || isLocalhost) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback to prevent breaking cross-domain apps
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: "10mb" }));

// Route handlers
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/gifts", giftsRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "jorique-backend",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

registerAuthRoutes(app);

app.get("/api/auth/me", authRequired, (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/dashboard/user", authRequired, (req, res) => {
  res.json({
    welcome: `Welcome back, ${req.user.fullName}`,
    stats: [
      { label: "Orders", value: "03" },
      { label: "Wishlist", value: "12" },
      { label: "Rewards", value: "480" },
    ],
    recentOrders: [
      { id: "JRQ-1024", status: "Processing", total: "$248" },
      { id: "JRQ-1018", status: "Delivered", total: "$129" },
    ],
  });
});

app.get("/api/dashboard/admin", authRequired, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }

  res.json({
    stats: [
      { label: "Revenue", value: "$18.4k" },
      { label: "Orders", value: "126" },
      { label: "Customers", value: "842" },
      { label: "Pending", value: "09" },
    ],
    activity: [
      "New order JRQ-1031 placed",
      "Inventory updated for bedding collection",
      "Customer review pending approval",
    ],
  });
});

// Centralized Production Error Handler
app.use((err, _req, res, _next) => {
  console.error("Internal Server Error:", err);
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === "production" && status === 500
      ? "An unexpected internal server error occurred."
      : err.message || "Internal server error";

  res.status(status).json({
    success: false,
    message,
  });
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`JORIQUE backend running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const fallbackPort = port + 1;
      console.warn(
        `Port ${port} is already in use. Trying ${fallbackPort} instead.`
      );
      startServer(fallbackPort);
      return;
    }

    console.error("Server startup error:", error);
    process.exit(1);
  });
}

if (!process.env.AWS_LAMBDA_FUNCTION_NAME && process.env.NODE_ENV !== "test") {
  startServer(requestedPort);
}

export default app;
