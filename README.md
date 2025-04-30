# Eateos - Food Ordering Application

Eateos is a full-stack web application for restaurant food ordering, allowing users to browse menu items, add items to cart, place orders, and track order history. The application uses a hybrid database approach with MongoDB and PostgreSQL for different aspects of the system.

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB (for menu items)
- PostgreSQL (for user accounts, orders, and cart)
- Prisma ORM
- JWT Authentication

### Frontend

- React.js
- Context API for state management
- React Router for navigation
- CSS for styling

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas connection)
- PostgreSQL (local or remote connection)

### Backend Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/eateos.git
cd eateos
```

2. Install all dependencies (server and client)

```bash
npm run install-all
```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=mongodb://localhost:27017/eateos
DATABASE_URL="postgresql://username:password@localhost:5432/eateos?schema=public"
```

4. Set up PostgreSQL with Prisma

```bash
npx prisma migrate dev --name init
```

5. Running the application
   You can run both the server and client concurrently using:

```bash
npm run dev
```

This will start:

- The backend server at http://localhost:4000
- The frontend client at http://localhost:3000

Alternatively, you can run them separately:

```bash
# Run only the server
npm run server

# Run only the client
npm run client
```

## Database Design Choices

### MongoDB vs PostgreSQL

This application uses a hybrid database approach:

#### MongoDB (Document Database)

- Used for storing menu items
- Benefits:
  - Flexible schema for menu items that may have varying attributes
  - Better performance for read-heavy operations like menu browsing
  - Easier to store nested data like ingredients and nutritional information
  - Simpler schema evolution as menu items change over time

#### PostgreSQL (Relational Database)

- Used for user accounts, orders, and cart management
- Benefits:
  - Strong data integrity with referential constraints for orders and order items
  - Better for complex querying across related entities (user orders, items, etc.)
  - ACID compliance for critical transactions like order processing
  - Better support for data relationships and joins

### Dual Database Justification

- MongoDB provides flexibility for content-centric data (menu items)
- PostgreSQL offers reliability for transaction-critical data (orders, payments)
- This hybrid approach leverages the strengths of both database types

## API Endpoints

### User Routes

- `POST /api/users` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users` - Get all users (admin only)

### Menu Routes

- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get menu items by category
- `GET /api/menu/:id` - Get menu item by ID
- `POST /api/menu` - Add a new menu item
- `PUT /api/menu/:id` - Update a menu item (admin only)
- `DELETE /api/menu/:id` - Delete a menu item (admin only)

### Cart Routes (All Protected)

- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart/items` - Clear cart

### Order Routes (All Protected)

- `POST /api/orders` - Create a new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/admin/orders` - Get all orders (admin only)
- `PUT /api/orders/admin/orders/:id` - Update order status (admin only)

## Deployed Application

The frontend application is deployed on Netlify: [Eateos](https://eateos-foodordering.netlify.app/)

## Assumptions and Challenges

### Assumptions

1. Users need to be authenticated to place orders
2. Admin users have special privileges to manage menu items and view all orders
3. The application is designed primarily for single-restaurant use
4. Payment processing is handled separately (not implemented in this version)

### Challenges

1. **Dual Database Integration**: Implementing and managing two database systems required careful orchestration, particularly when dealing with related data across systems.

2. **Foreign Key Constraints**: The order creation process had challenges with foreign key constraints, especially when creating order items that reference menu items across different databases.

3. **State Management**: Managing the cart state across components and syncing with the backend required careful implementation of context providers.

4. **Authentication Flow**: Implementing secure authentication with JWT tokens and proper authorization checks for protected routes required attention to security details.

## Future Improvements

1. Implement real-time order tracking
2. Add payment processing integration
3. Enhance the admin dashboard for order management
4. Implement search functionality for menu items
5. Add user reviews and ratings for menu items

## Note on AI Tools

AI code generation tools were used to assist in developing certain aspects of this application. However, all code has been reviewed, tested, and understood before implementation. The hybrid database architecture and the order processing workflow were custom-designed based on the specific requirements of the application.

## License

MIT
