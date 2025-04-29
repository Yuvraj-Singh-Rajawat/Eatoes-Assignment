const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],
    allergens: [
      {
        type: String,
        trim: true,
      },
    ],
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    preparationTime: {
      type: Number, // in minutes
      default: 20,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
MenuItemSchema.index({ category: 1 });
MenuItemSchema.index({ available: 1 });

const MenuItem = mongoose.model("MenuItem", MenuItemSchema);

module.exports = MenuItem;
