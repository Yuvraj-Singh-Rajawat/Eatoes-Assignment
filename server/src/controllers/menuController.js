const MenuItem = require("../models/MenuItem");

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ category: 1 });
    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
};

// @desc    Get menu item by ID
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(menuItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ message: "Failed to fetch menu item" });
  }
};

// @desc    Add a new menu item
// @route   POST /api/menu
// @access  Private/Admin
const addMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      available,
      ingredients,
      allergens,
      nutritionalInfo,
      preparationTime,
    } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "Please provide name, description, price, and category",
      });
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      price: parseFloat(price),
      category,
      image: image || null,
      available: available !== undefined ? available : true,
      ingredients: ingredients || [],
      allergens: allergens || [],
      nutritionalInfo: nutritionalInfo || {},
      preparationTime: preparationTime || 20,
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Failed to create menu item" });
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      image,
      available,
      ingredients,
      allergens,
      nutritionalInfo,
      preparationTime,
    } = req.body;

    // Check if item exists
    const existingItem = await MenuItem.findById(id);

    if (!existingItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Create update object
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = image;
    if (available !== undefined) updateData.available = available;
    if (ingredients !== undefined) updateData.ingredients = ingredients;
    if (allergens !== undefined) updateData.allergens = allergens;
    if (nutritionalInfo !== undefined)
      updateData.nutritionalInfo = nutritionalInfo;
    if (preparationTime !== undefined)
      updateData.preparationTime = preparationTime;

    // Update the item
    const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Failed to update menu item" });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const existingItem = await MenuItem.findById(id);

    if (!existingItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Delete the item
    await MenuItem.findByIdAndDelete(id);

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Failed to delete menu item" });
  }
};

// @desc    Get menu items by category
// @route   GET /api/menu/category/:category
// @access  Public
const getMenuItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const menuItems = await MenuItem.find({
      category: { $regex: new RegExp(category, "i") },
    }).sort({ name: 1 });

    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items by category:", error);
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory,
};
