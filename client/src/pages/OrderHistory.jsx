import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserOrders } from "../services/orderService";
import { toast } from "react-toastify";
import { FaShoppingBag, FaArrowRight, FaReceipt, FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await getUserOrders();

        if (result.success) {
          setOrders(result.data);
        } else {
          toast.error(result.message || "Failed to fetch your orders");
        }
      } catch (error) {
        toast.error("An error occurred while fetching your orders");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time to readable format
  const formatTime = (dateString) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Get status badge color based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case "PROCESSING":
        return "bg-blue-500 text-white";
      case "COMPLETED":
        return "bg-green-500 text-white";
      case "CANCELLED":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-red-100 text-red-600 p-2 rounded-lg mb-3">
            <FaReceipt className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Your Order History</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Track your previous orders and reorder your favorite meals with just a few clicks.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-lg mx-auto border border-gray-100">
            <div className="bg-red-50 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Orders Yet</h3>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start exploring our delicious menu and place your first order!</p>
            <Link to="/menu" className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium shadow-lg hover:from-orange-600 hover:to-red-700 transition duration-300">
              Browse Menu
              <FaArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col md:flex-row">
                  {/* Left Column with Order Info */}
                  <div className="p-6 md:p-8 md:w-3/5 border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center mr-3">
                          #{order.id.slice(-3)}
                        </span>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">Order #{order.id.slice(0, 8)}</h3>
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <FaCalendarAlt className="h-3 w-3 mr-1" />
                            <span className="mr-3">{formatDate(order.createdAt)}</span>
                            <FaClock className="h-3 w-3 mr-1" />
                            <span>{formatTime(order.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Order Items</h4>
                      <div className="space-y-3 max-h-48 overflow-auto pr-2">
                        {order.OrderItem && order.OrderItem.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                            <div className="flex items-center">
                              <div className="bg-red-50 text-red-600 font-medium rounded-md px-2 py-1 mr-3 text-xs">
                                {item.quantity}x
                              </div>
                              <span className="text-gray-800 font-medium">
                                {item.menuItem?.name || "Unknown Item"}
                              </span>
                            </div>
                            <span className="font-semibold text-gray-800">
                              ${parseFloat(item.price).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <FaMapMarkerAlt className="h-3 w-3 mr-2" />
                      <span>Delivered to: {order.deliveryAddress || "Default Address"}</span>
                    </div>
                  </div>
                  
                  {/* Right Column with Summary and Actions */}
                  <div className="bg-gray-50 p-6 md:p-8 md:w-2/5 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">Order Summary</h4>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-gray-800">${parseFloat(order.total - 3.99).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Delivery Fee</span>
                          <span className="text-gray-800">$3.99</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold">
                          <span className="text-gray-800">Total</span>
                          <span className="text-red-600 text-lg">${parseFloat(order.total).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-auto">
                      <Link 
                        to={`/orders/${order.id}`} 
                        className="block w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium text-center hover:from-orange-600 hover:to-red-700 transition duration-300"
                      >
                        View Order Details
                      </Link>
                      <button 
                        className="block w-full py-3 rounded-lg bg-white border border-gray-200 text-gray-800 font-medium text-center hover:bg-gray-50 transition duration-300"
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;