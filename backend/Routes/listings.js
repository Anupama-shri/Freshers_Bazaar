const express = require("express");
const Listing = require("../Models/Listing");
const { protect } = require("../Middleware/auth");
const cloudinary = require("../config/cloudinary");
const router = express.Router();

// Get all listings
router.get("/", async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, status } = req.query;
    let filter = { status: "Available" };

    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    const listings = await Listing.find(filter)
      .populate("seller", "name rating profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single listing
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // Increment views
      { returnDocument: "after" },
    ).populate("seller", "name rating profilePicture phone email");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create listing (Protected)
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, price, category, condition, location, images } =
      req.body;

    const uploadedImageUrls = await Promise.all(
      (images || []).map(async (image) => {
        if (typeof image !== "string" || image.trim() === "") {
          return null;
        }

        if (image.startsWith("http://") || image.startsWith("https://")) {
          return image;
        }

        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: "freshers-bazaar/listings",
        });

        return uploadResult.secure_url;
      }),
    );

    const listing = await Listing.create({
      title,
      description,
      price,
      category,
      condition,
      location,
      images: uploadedImageUrls.filter(Boolean),
      seller: req.user.id,
    });

    res.status(201).json({
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update listing (Protected)
router.put("/:id", protect, async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user is owner
    if (listing.seller.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this listing" });
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json({
      message: "Listing updated successfully",
      listing,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete listing (Protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user is owner
    if (listing.seller.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this listing" });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's listings
router.get("/user/:userId", async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.params.userId }).populate(
      "seller",
      "name rating",
    );

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
