const { PrismaClient } = require("@prisma/client");

// Create a single instance of PrismaClient
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Test the connection
const connectPrisma = async () => {
  try {
    await prisma.$connect();
    // console.log("Prisma client connected successfully");
  } catch (error) {
    console.error("Failed to connect to Prisma:", error);
    if (error.code === "P1001") {
      console.error(
        "Cannot connect to the database. Please check your DATABASE_URL in .env file"
      );
    }
    process.exit(1);
  }
};

// Connect to Prisma
connectPrisma();

module.exports = prisma;
