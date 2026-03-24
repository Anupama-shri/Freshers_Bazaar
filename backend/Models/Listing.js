const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
    min: 0,
  },
  category: {
    type: String,
    enum: ["Books", "Electronics", "Furniture", "Clothing", "Sports", "Other"],
    required: true,
  },
  condition: {
    type: String,
    enum: ["Like New", "Good", "Fair", "Poor"],
    required: true,
  },
  images: [
    {
      type: String, // URL or file path
    },
  ],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "Sold", "Inactive"],
    default: "Available",
  },
  location: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Listing", listingSchema);
