const prisma = require("../config/prisma");

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get cart with items
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    // If no cart exists, create one
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: [],
        },
      });
    }

    res.json(cart);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Failed to retrieve cart" });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemData = req.body;

    if (
      !itemData.id ||
      !itemData.name ||
      !itemData.price ||
      !itemData.quantity
    ) {
      return res.status(400).json({ message: "Missing required item fields" });
    }

    // Get current cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: [],
        },
      });
    }

    // Parse items array from JSON if needed
    let items = Array.isArray(cart.items) ? cart.items : [];

    // Check if item already exists in cart
    const existingItemIndex = items.findIndex(
      (item) => item.id === itemData.id
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      items[existingItemIndex].quantity += itemData.quantity;
    } else {
      // Add new item
      items.push(itemData);
    }

    // Update cart in database
    const updatedCart = await prisma.cart.update({
      where: { userId },
      data: { items },
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:id
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Get current cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Parse items array from JSON if needed
    let items = Array.isArray(cart.items) ? cart.items : [];

    // Find item in cart
    const itemIndex = items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update quantity
    items[itemIndex].quantity = quantity;

    // Update cart in database
    const updatedCart = await prisma.cart.update({
      where: { userId },
      data: { items },
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:id
// @access  Private
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;

    // Get current cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Parse items array from JSON if needed
    let items = Array.isArray(cart.items) ? cart.items : [];

    // Filter out the item to remove
    const updatedItems = items.filter((item) => item.id !== itemId);

    // If no items were removed, the item wasn't in the cart
    if (updatedItems.length === items.length) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update cart in database
    const updatedCart = await prisma.cart.update({
      where: { userId },
      data: { items: updatedItems },
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

// @desc    Clear all items from cart
// @route   DELETE /api/cart/items
// @access  Private
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Update cart with empty items array
    const updatedCart = await prisma.cart.update({
      where: { userId },
      data: { items: [] },
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
