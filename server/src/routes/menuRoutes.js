const express = require("express");
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory,
} = require("../controllers/menuController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getMenuItems);
router.get("/category/:category", getMenuItemsByCategory);
router.get("/:id", getMenuItemById);

// For testing - Allow menu creation without auth temporarily
router.post("/", addMenuItem);

// Protected admin routes
router.put("/:id", protect, admin, updateMenuItem);
router.delete("/:id", protect, admin, deleteMenuItem);

module.exports = router;
