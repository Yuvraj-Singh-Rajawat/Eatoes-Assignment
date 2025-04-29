import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { createOrder } from "../services/orderService";
import { FaShoppingCart, FaTrash, FaArrowRight } from "react-icons/fa";

const Cart = () => {
  const { cart, loading, removeFromCart, updateCartItem, clearCart } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Calculate cart total
  const calculateTotal = () => {
    if (!cart.items || cart.items.length === 0) return "0.00";
    return cart.items
      .reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    const result = await updateCartItem(itemId, quantity);
    if (!result.success) {
      toast.error(result.message || "Failed to update item");
    }
  };

  const handleRemoveItem = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (!result.success) {
      toast.error(result.message || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (result.success) {
      toast.success("Cart cleared successfully");
    } else {
      toast.error(result.message || "Failed to clear cart");
    }
  };

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  const handlePlaceOrder = async () => {
    if (!cart.items || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!user) {
      toast.error("Please login to place an order");
      return;
    }

    try {
      const orderData = {
        items: cart.items,
        total: parseFloat(calculateTotal()),
        deliveryAddress: user.address || "Default delivery address",
      };

      const result = await createOrder(orderData);

      if (result.success) {
        toast.success("Order placed successfully!");
        await clearCart();
      } else {
        toast.error(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Your Cart</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-red-600 mx-auto"></div>
        </div>

        {!cart.items || cart.items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-lg mx-auto">
            <div className="text-red-500 mb-4">
              <FaShoppingCart className="h-16 w-16 mx-auto opacity-50" />
            </div>
            <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
            <Link to="/menu" className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium shadow-lg hover:from-orange-600 hover:to-red-700 transition duration-300">
              Browse Menu
              <FaArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <h2 className="text-xl font-semibold">Order Items</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
              {cart.items.map((item) => (
  <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50 transition">
    <div className="flex-1 mb-4 md:mb-0">
      <h3 className="font-medium text-lg text-gray-800">{item.name}</h3>
      <p className="text-red-600 font-bold">${parseFloat(item.price).toFixed(2)}</p>
      <p className="text-gray-500 text-sm hidden md:block">{item.description}</p>
    </div>

    <div className="flex items-center justify-between md:justify-end md:space-x-6">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </button>
        <span className="text-gray-800 font-medium w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
          className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="text-gray-800 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          className="text-red-500 hover:text-red-700 text-sm flex items-center mt-1"
          onClick={() => handleRemoveItem(item.id)}
        >
          <FaTrash className="h-3 w-3 mr-1" />
          Remove
        </button>
      </div>
    </div>
  </div>
))}

              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="px-6 py-8">
                <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                  <span className="text-gray-600 text-lg">Subtotal:</span>
                  <span className="text-gray-800 text-lg font-bold">${calculateTotal()}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                  <span className="text-gray-600 text-lg">Delivery Fee:</span>
                  <span className="text-gray-800 text-lg font-bold">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 text-xl font-bold">Total:</span>
                  <span className="text-red-600 text-2xl font-bold">${calculateTotal()}</span>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row sm:justify-between gap-4">
                  <button 
                    className="px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition duration-300 flex items-center justify-center"
                    onClick={handleClearCart}
                  >
                    <FaTrash className="h-4 w-4 mr-2" />
                    Clear Cart
                  </button>
                  
                  <button
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium shadow-lg hover:from-orange-600 hover:to-red-700 transition duration-300 flex items-center justify-center cursor-pointer"
                    onClick={handlePlaceOrder}
                    disabled={!user}
                  >
                    {user ? "Place Order" : "Login to Order"}
                    <FaArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>

                {!user && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600">
                      Please{" "}
                      <Link to="/login" className="text-red-600 font-medium hover:text-red-700">
                        login
                      </Link>{" "}
                      to complete your purchase
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;