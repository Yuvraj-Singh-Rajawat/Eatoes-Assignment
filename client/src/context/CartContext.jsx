import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import api from "../config/api";
import { AuthContext } from "./AuthContext";

// Create context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Memoize fetchCart to prevent unnecessary recreations
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("/cart");
      setCart(response.data || { items: [] });
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart({ items: [] });
      if (error.response?.status !== 401) {
        // Don't show error for auth issues
        toast.error(error.response?.data?.message || "Failed to load cart");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Only fetch cart when user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user, fetchCart]);

  // Add item to cart
  const addToCart = async (item) => {
    if (!user)
      return { success: false, message: "Please login to add items to cart" };

    setLoading(true);
    try {
      // // console.log(item)
      // const data = {item.id, item.name, item.price, item.quantity: "1"}
      const response = await api.post("/cart/items", {
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
      setCart(response.data);
      return { success: true };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add item to cart",
      };
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    if (!user)
      return { success: false, message: "Please login to update cart" };

    setLoading(true);
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      setCart(response.data);
      return { success: true };
    } catch (error) {
      console.error("Error updating cart item:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update cart item",
      };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!user)
      return { success: false, message: "Please login to remove items" };

    setLoading(true);
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      setCart(response.data);
      toast.success("Item removed from cart");
      return { success: true };
    } catch (error) {
      console.error("Error removing from cart:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to remove item from cart",
      };
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user) return { success: false, message: "Please login to clear cart" };

    setLoading(true);
    try {
      const response = await api.delete("/cart/items");
      setCart(response.data);
      return { success: true };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to clear cart",
      };
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart total
  const getCartTotal = () => {
    if (!cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    refreshCart: fetchCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Export the context for direct import
export { CartContext };
