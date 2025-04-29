const express = require("express");
const router = express.Router();
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// Protect all cart routes - require authentication
router.use(protect);

// Get cart and clear cart routes
router.route("/").get(getCart);

// Item management routes
router.route("/items").post(addItemToCart).delete(clearCart);

// Individual item routes
router.route("/items/:id").put(updateCartItem).delete(removeCartItem);

module.exports = router;
