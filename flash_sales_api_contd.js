// controllers/saleController.js (continued)
// Get current sale status
exports.getSaleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sale = await Sale.findById(id).populate("product");
  if (!sale) {
    return res.status(404).json({
      status: "error",
      message: "Sale not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      sale: {
        id: sale._id,
        product: sale.product,
        initialStock: sale.initialStock,
        currentStock: sale.currentStock,
        startTime: sale.startTime,
        isActive: sale.isActive,
        isCurrentlyActive: sale.isCurrentlyActive(),
      },
    },
  });
});

// Make a purchase (with concurrency control)
exports.makePurchase = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { saleId, quantity = 1 } = req.body;
    const userId = req.user._id;

    // Find the sale and lock it for update
    const sale = await Sale.findById(saleId).session(session);

    if (!sale) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: "error",
        message: "Sale not found",
      });
    }

    // Check if sale is active
    if (!sale.isCurrentlyActive()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "This sale is not currently active",
      });
    }

    // Check if enough stock is available
    if (sale.currentStock < quantity) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "Not enough units available",
      });
    }

    // Check if user has already purchased the limit
    const userPurchases = await Purchase.countDocuments({
      user: userId,
      sale: saleId,
    }).session(session);

    if (userPurchases >= sale.limitPerUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: `You have reached the purchase limit of ${sale.limitPerUser} for this sale`,
      });
    }

    // Update the stock (atomically)
    sale.currentStock -= quantity;
    await sale.save({ session });

    // If stock reaches zero, end the sale
    if (sale.currentStock === 0) {
      sale.endTime = new Date();
      await sale.save({ session });
    }

    // Create purchase record
    const purchase = await Purchase.create(
      [
        {
          user: userId,
          sale: saleId,
          product: sale.product,
          quantity,
          purchaseTime: new Date(),
        },
      ],
      { session }
    );

    // Update user's purchases
    await User.findByIdAndUpdate(
      userId,
      { $push: { purchases: purchase[0]._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: "success",
      data: {
        purchase: purchase[0],
        remainingStock: sale.currentStock,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

// Reset a sale (for administrative purposes)
exports.resetSale = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newStock } = req.body;

  const sale = await Sale.findById(id);
  if (!sale) {
    return res.status(404).json({
      status: "error",
      message: "Sale not found",
    });
  }

  // Reset stock and other parameters
  sale.currentStock = newStock || sale.initialStock;
  sale.isActive = false;
  sale.startTime = null;
  sale.endTime = null;
  await sale.save();

  // Delete all associated purchases for this sale
  await Purchase.deleteMany({ sale: id });

  res.status(200).json({
    status: "success",
    message: "Sale has been reset",
    data: {
      sale,
    },
  });
});

// List all active sales
exports.getActiveSales = asyncHandler(async (req, res) => {
  const now = new Date();
  const activeSales = await Sale.find({
    isActive: true,
    startTime: { $lte: now },
    $or: [{ endTime: { $gte: now } }, { endTime: null }],
    currentStock: { $gt: 0 },
  }).populate("product");

  res.status(200).json({
    status: "success",
    results: activeSales.length,
    data: {
      sales: activeSales,
    },
  });
});

// controllers/leaderboardController.js
const Purchase = require("../models/Purchase");
const asyncHandler = require("../utils/asyncHandler");

// Get leaderboard for a specific sale
exports.getSaleLeaderboard = asyncHandler(async (req, res) => {
  const { saleId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const purchases = await Purchase.find({ sale: saleId })
    .populate({
      path: "user",
      select: "name email",
    })
    .sort({ purchaseTime: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const totalPurchases = await Purchase.countDocuments({ sale: saleId });

  res.status(200).json({
    status: "success",
    results: purchases.length,
    totalPages: Math.ceil(totalPurchases / limit),
    currentPage: page,
    data: {
      leaderboard: purchases,
    },
  });
});

// 8. Routes
// routes/authRoutes.js
const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;

// routes/saleRoutes.js
const express = require("express");
const saleController = require("../controllers/saleController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.get("/active", saleController.getActiveSales);
router.get("/:id/status", saleController.getSaleStatus);

// Protected routes
router.use(protect);
router.post("/", saleController.createSale);
router.patch("/:id/activate", saleController.activateSale);
router.post("/purchase", saleController.makePurchase);
router.patch("/:id/reset", saleController.resetSale);

module.exports = router;

// routes/leaderboardRoutes.js
const express = require("express");
const leaderboardController = require("../controllers/leaderboardController");

const router = express.Router();

router.get("/:saleId", leaderboardController.getSaleLeaderboard);

module.exports = router;

// 9. Express App
// app.js
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const saleRoutes = require("./routes/saleRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  max: 100, // 100 requests per IP
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "Too many requests from this IP, please try again in 15 minutes!",
});
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10kb" }));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/sales", saleRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);

// Catch-all unhandled routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;

// 10. Server Entry Point
// server.js
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const config = require("./config/config");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Connect to database
connectDB();

// Start server
const server = app.listen(config.port, () => {
  console.log(`Server running in ${config.env} mode on port ${config.port}`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
