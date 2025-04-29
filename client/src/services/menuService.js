import api from "../config/api";

// Get all menu items
export const getAllMenuItems = async () => {
  try {
    const response = await api.get("/menu");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch menu items",
    };
  }
};

// Get menu items by category
export const getMenuItemsByCategory = async (category) => {
  try {
    const response = await api.get(`/menu/category/${category}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching menu items by category:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch menu items",
    };
  }
};

// Get a menu item by ID
export const getMenuItemById = async (id) => {
  try {
    const response = await api.get(`/menu/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch menu item",
    };
  }
};

// Add a new menu item (admin only)
export const addMenuItem = async (itemData) => {
  try {
    const response = await api.post("/menu", itemData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding menu item:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to add menu item",
    };
  }
};

// Update a menu item (admin only)
export const updateMenuItem = async (id, itemData) => {
  try {
    const response = await api.put(`/menu/${id}`, itemData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating menu item:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update menu item",
    };
  }
};

// Delete a menu item (admin only)
export const deleteMenuItem = async (id) => {
  try {
    const response = await api.delete(`/menu/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete menu item",
    };
  }
};
