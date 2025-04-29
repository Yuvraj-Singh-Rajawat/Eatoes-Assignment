const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController.js");
const { protect, admin } = require("../middleware/authMiddleware.js");

// All order routes are protected
router.use(protect);

// Customer routes
router.post("/", createOrder);
router.get("/my-orders", getOrders);
router.get("/:id", getOrderById);

// Admin routes
router.route("/admin/orders").get(admin, getOrders);
router.route("/admin/orders/:id").put(admin, updateOrderStatus);

module.exports = router;
