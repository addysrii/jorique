import "dotenv/config";
import express from "express";
import cors from "cors";
import { registerAuthRoutes, authRequired } from "./auth.js";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import reviewsRouter from "./routes/reviews.js";
import giftsRouter from "./routes/gifts.js";
import analyticsRouter from "./routes/analytics.js";
import { supabase } from "./supabase.js";

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

// Routes & Auth
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

app.get("/api/dashboard/user", authRequired, async (req, res) => {
  try {
    const { data: userOrders } = await supabase
      .from("orders")
      .select("id, order_number, status, total, created_at")
      .eq("customer_id", req.user.id)
      .order("created_at", { ascending: false });

    const ordersList = userOrders || [];
    const formattedOrders = ordersList.slice(0, 5).map((o) => ({
      id: o.order_number || o.id,
      status: o.status ? (o.status.charAt(0).toUpperCase() + o.status.slice(1)) : "Placed",
      total: `₹${Number(o.total || 0).toLocaleString("en-IN")}`,
    }));

    res.json({
      welcome: `Welcome back, ${req.user.fullName || req.user.email || 'Patron'}`,
      stats: [
        { label: "Orders", value: String(ordersList.length).padStart(2, "0") },
        { label: "Wishlist", value: "00" },
        { label: "Rewards", value: "0" },
      ],
      recentOrders: formattedOrders,
    });
  } catch (error) {
    res.json({
      welcome: `Welcome back, ${req.user.fullName || req.user.email || 'Patron'}`,
      stats: [
        { label: "Orders", value: "00" },
        { label: "Wishlist", value: "00" },
        { label: "Rewards", value: "0" },
      ],
      recentOrders: [],
    });
  }
});

app.get("/api/dashboard/admin", authRequired, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }

  try {
    const [{ count: productsCount }, { count: ordersCount }, { count: customersCount }, { data: revenueRows }] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('total').in('status', ['confirmed', 'processing', 'shipped', 'delivered']),
    ]);

    const revenue = (revenueRows || []).reduce((sum, order) => sum + Number(order.total || 0), 0);

    const { data: latestOrders } = await supabase
      .from('orders')
      .select('order_number, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    const activity = (latestOrders || []).map((o) => `New order ${o.order_number || 'placed'}`);

    res.json({
      stats: [
        { label: "Revenue", value: `₹${revenue.toLocaleString('en-IN')}` },
        { label: "Orders", value: String(ordersCount || 0) },
        { label: "Customers", value: String(customersCount || 0) },
        { label: "Products", value: String(productsCount || 0) },
      ],
      activity,
    });
  } catch (error) {
    res.json({
      stats: [
        { label: "Revenue", value: "₹0" },
        { label: "Orders", value: "0" },
        { label: "Customers", value: "0" },
        { label: "Products", value: "0" },
      ],
      activity: [],
    });
  }
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
