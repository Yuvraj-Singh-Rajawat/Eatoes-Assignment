const prisma = require("../config/prisma");
const MenuItem = require("../models/MenuItem");

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, total, deliveryAddress } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ message: "Invalid order total" });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    console.log("Creating order with data:", {
      userId,
      items,
      total,
      deliveryAddress,
    });

    // Create the order in PostgreSQL
    const order = await prisma.order.create({
      data: {
        userId,
        items,
        total,
        deliveryAddress,
        status: "PENDING",
      },
    });

    console.log("Order created:", order);

    // Get existing menu items to store in orderItems
    try {
      // Get the MongoDB menu items
      const menuItemIds = items.map((item) => item.id);
      const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

      console.log(`Found ${menuItems.length} menu items in MongoDB`);

      // Check if we have PostgreSQL menu items
      const pgMenuItems = await prisma.menuItem.findMany({
        where: {
          name: {
            in: items.map((item) => item.name),
          },
        },
      });

      console.log(`Found ${pgMenuItems.length} menu items in PostgreSQL`);

      // Create a map for quick lookups
      const pgMenuItemMap = {};
      pgMenuItems.forEach((item) => {
        pgMenuItemMap[item.name] = item.id;
      });

      // Create order items in PostgreSQL
      const orderItems = [];

      for (const item of items) {
        // Find matching PostgreSQL menu item by name
        const pgMenuItem = pgMenuItems.find((mi) => mi.name === item.name);

        if (pgMenuItem) {
          console.log(
            `Creating order item for ${item.name} with ID ${pgMenuItem.id}`
          );

          const orderItem = await prisma.orderItem.create({
            data: {
              orderId: order.id,
              menuItemId: pgMenuItem.id,
              quantity: item.quantity,
              price: item.price,
            },
          });

          orderItems.push(orderItem);
        } else {
          console.log(`Could not find matching menu item for: ${item.name}`);
          // Create a new menu item in PostgreSQL if needed
          try {
            const newMenuItem = await prisma.menuItem.create({
              data: {
                name: item.name,
                description: item.description || "Imported from order",
                price: parseFloat(item.price),
                category: item.category || "Other",
                image: item.image || null,
                available: true,
                ingredients: [],
                allergens: [],
              },
            });

            console.log(
              `Created new menu item in PostgreSQL: ${newMenuItem.name} with ID ${newMenuItem.id}`
            );

            // Now create the order item with the new menu item
            const orderItem = await prisma.orderItem.create({
              data: {
                orderId: order.id,
                menuItemId: newMenuItem.id,
                quantity: item.quantity,
                price: item.price,
              },
            });

            orderItems.push(orderItem);
          } catch (createError) {
            console.error(`Error creating menu item: ${createError.message}`);
          }
        }
      }

      // Clear the user's cart after successful order
      await prisma.cart.update({
        where: { userId },
        data: { items: [] },
      });

      res.status(201).json({
        success: true,
        order: {
          ...order,
          orderItems,
        },
      });
    } catch (itemError) {
      console.error("Error creating order items:", itemError);
      // If creating items fails, delete the order to maintain consistency
      await prisma.order.delete({ where: { id: order.id } });
      return res.status(500).json({
        message: "Failed to create order items: " + itemError.message,
      });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Failed to create order: " + error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    // For admin, get all orders
    const where = isAdmin ? {} : { userId };

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        OrderItem: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    // Query parameters
    const where = { id: orderId };

    // If not admin, only allow access to own orders
    if (!isAdmin) {
      where.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        OrderItem: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/admin/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      !status ||
      !["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        OrderItem: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
