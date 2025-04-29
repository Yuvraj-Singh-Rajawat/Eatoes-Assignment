import api from "../config/api";

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create order",
    };
  }
};

// Get user's orders
export const getUserOrders = async () => {
  try {
    const response = await api.get("/orders/my-orders");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch orders",
    };
  }
};

// Get order details by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch order",
    };
  }
};

// Admin: Get all orders
export const getAllOrders = async () => {
  try {
    const response = await api.get("/orders/admin/orders");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch orders",
    };
  }
};

// Admin: Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/orders/admin/orders/${orderId}`, {
      status,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update order status",
    };
  }
};
