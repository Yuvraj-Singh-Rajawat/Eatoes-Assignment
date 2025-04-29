import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaBox,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStar,
  FaTruck,
  FaReceipt,
  FaPhoneAlt,
  FaStoreAlt,
  FaRegClock,
} from "react-icons/fa";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingExpanded, setTrackingExpanded] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const result = await getOrderById(id);

        if (result.success) {
          setOrder(result.data);
        } else {
          toast.error(result.message || "Failed to fetch order details");
        }
      } catch (error) {
        toast.error("An error occurred while fetching order details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class based on order status
  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get tracking step based on order status
  const getTrackingSteps = () => {
    const steps = [
      { name: "Order Placed", icon: <FaReceipt />, completed: true },
      {
        name: "Preparing",
        icon: <FaStoreAlt />,
        completed: ["PROCESSING", "COMPLETED"].includes(order?.status),
      },
      {
        name: "Out for Delivery",
        icon: <FaTruck />,
        completed: order?.status === "COMPLETED",
      },
      {
        name: "Delivered",
        icon: <FaBox />,
        completed: order?.status === "COMPLETED",
      },
    ];

    if (order?.status === "CANCELLED") {
      return [
        { name: "Order Placed", icon: <FaReceipt />, completed: true },
        {
          name: "Cancelled",
          icon: <FaRegClock />,
          completed: true,
          isCancelled: true,
        },
      ];
    }

    return steps;
  };

  const handleRateOrder = () => {
    setIsRatingModalOpen(true);
  };

  const submitRating = () => {
    // In a real application, this would call an API to submit the rating
    toast.success(`Thank you! You rated this order ${ratingValue} stars.`);
    setIsRatingModalOpen(false);
  };

  const handleReorder = () => {
    // Logic to add all items back to cart
    if (order?.OrderItem?.length) {
      toast.success("Items added to your cart");
      // In a real application, this would add items to cart then redirect
      setTimeout(() => navigate("/cart"), 1500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">
            <FaBox className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Link
            to="/orders"
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium shadow-lg hover:from-orange-600 hover:to-red-700 transition duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const trackingSteps = getTrackingSteps();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Section */}
      <section className="relative py-12 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center">
            <Link
              to="/orders"
              className="flex items-center text-white hover:text-gray-100 mr-6 transition duration-300"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to Orders</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">Order Details</h1>
          </div>
          <p className="mt-2 text-gray-100 max-w-xl">
            Track your order status, view items, and manage delivery details
          </p>
        </div>

        {/* Decorative pattern */}
        <div className="absolute right-0 bottom-0 opacity-10">
          <svg
            width="160"
            height="70"
            viewBox="0 0 160 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0H20V20H0V0Z" fill="white" />
            <path d="M20 20H40V40H20V20Z" fill="white" />
            <path d="M40 0H60V20H40V0Z" fill="white" />
            <path d="M60 20H80V40H60V20Z" fill="white" />
            <path d="M80 0H100V20H80V0Z" fill="white" />
            <path d="M100 20H120V40H100V20Z" fill="white" />
            <path d="M120 0H140V20H120V0Z" fill="white" />
            <path d="M140 20H160V40H140V20Z" fill="white" />
            <path d="M0 40H20V60H0V40Z" fill="white" />
            <path d="M40 40H60V60H40V40Z" fill="white" />
            <path d="M80 40H100V60H80V40Z" fill="white" />
            <path d="M120 40H140V60H120V40Z" fill="white" />
            <path d="M20 60H40V80H20V60Z" fill="white" />
            <path d="M60 60H80V80H60V60Z" fill="white" />
            <path d="M100 60H120V80H100V60Z" fill="white" />
          </svg>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Order Summary and Tracking Card */}
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
            <div>
              <div className="flex items-center">
                <div className="bg-red-100 text-red-600 rounded-full p-2 w-10 h-10 flex items-center justify-center mr-3">
                  <FaBox className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Order #{order.id.slice(0, 8)}
                </h2>
              </div>
              <div className="flex items-center mt-2 text-gray-600">
                <FaCalendarAlt className="mr-2 text-red-500" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
            <div
              className={`${getStatusClass(
                order.status
              )} px-4 py-2 rounded-full font-medium mt-4 md:mt-0 flex items-center`}
            >
              <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
              {order.status}
            </div>
          </div>

          {/* Order Tracking */}
          <div
            className="cursor-pointer hover:bg-gray-50 p-4 rounded-lg mb-4 transition duration-300"
            onClick={() => setTrackingExpanded(!trackingExpanded)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-red-100 text-red-600 rounded-full p-2 w-10 h-10 flex items-center justify-center mr-3">
                  <FaTruck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Delivery Status
                </h3>
              </div>
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  trackingExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {trackingExpanded && (
            <div className="pb-4 pt-2 px-1">
              <div className="flex items-start">
                <div className="flex flex-col items-center">
                  {trackingSteps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`${
                          step.completed
                            ? step.isCancelled
                              ? "bg-red-500"
                              : "bg-green-500"
                            : "bg-gray-300"
                        } rounded-full p-3 text-white`}
                      >
                        {step.icon}
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div
                          className={`h-12 w-0.5 ${
                            trackingSteps[index + 1].completed
                              ? trackingSteps[index + 1].isCancelled
                                ? "bg-red-500"
                                : "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="ml-6 flex flex-col justify-between">
                  {trackingSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`pb-8 ${
                        index === trackingSteps.length - 1 ? "" : ""
                      }`}
                    >
                      <p
                        className={`font-medium ${
                          step.completed
                            ? step.isCancelled
                              ? "text-red-600"
                              : "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {step.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {index === 0 && formatDate(order.createdAt)}
                        {step.isCancelled && "Your order has been cancelled"}
                        {index === trackingSteps.length - 1 &&
                          step.completed &&
                          !step.isCancelled &&
                          "Delivered on time"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <div className="flex items-start">
              <div className="bg-red-100 text-red-600 rounded-full p-2 w-10 h-10 flex items-center justify-center mr-3">
                <FaMapMarkerAlt className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  Delivery Address
                </h3>
                <p className="text-gray-600">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Contact Restaurant Button */}
          <div className="border-t pt-6 mt-6">
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition duration-300">
              <FaPhoneAlt className="mr-2 text-green-600" />
              Contact Restaurant
            </button>
          </div>
        </div>

        {/* Order Items Card */}
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Order Items</h3>

          <div className="space-y-4 mb-6">
            {order.OrderItem && order.OrderItem.length > 0 ? (
              order.OrderItem.map((item) => (
                <div key={item.id} className="flex items-center border-b pb-4">
                  <div className="h-20 w-20 bg-gray-200 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                    {item.menuItem?.image ? (
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-800">
                      {item.menuItem?.name || "Unknown Item"}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      ${parseFloat(item.price).toFixed(2)} x {item.quantity}
                    </p>
                    {item.menuItem?.description && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {item.menuItem.description}
                      </p>
                    )}
                  </div>
                  <div className="font-bold text-gray-800 ml-4">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6">
                No items found in this order
              </p>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-800">
                ${parseFloat(order.total - (order.deliveryFee || 0)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Delivery Fee:</span>
              <span className="text-gray-800">
                ${parseFloat(order.deliveryFee || 0).toFixed(2)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Discount:</span>
                <span className="text-green-600">
                  -${parseFloat(order.discount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-3 border-t mt-2 pt-3">
              <span className="font-bold text-lg">Total:</span>
              <span className="font-bold text-lg text-red-600">
                ${parseFloat(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8 mb-12">
          {order.status === "COMPLETED" && (
            <button
              onClick={handleRateOrder}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium shadow-lg hover:from-orange-600 hover:to-red-700 transition duration-300"
            >
              <FaStar className="mr-2" />
              Rate Your Order
            </button>
          )}

          <button
            onClick={handleReorder}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 text-white font-medium shadow-lg hover:from-gray-700 hover:to-gray-900 transition duration-300"
          >
            <FaBox className="mr-2" />
            Reorder
          </button>
        </div>
      </div>

      {/* Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Rate Your Order
            </h3>
            <p className="text-gray-600 mb-6">
              How was your experience with this order?
            </p>

            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingValue(star)}
                  className="mx-1 text-3xl focus:outline-none"
                >
                  <FaStar
                    className={
                      star <= ratingValue ? "text-yellow-400" : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              placeholder="Additional comments (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              rows={3}
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg text-white font-medium hover:from-orange-600 hover:to-red-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
