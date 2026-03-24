const express = require("express");
const User = require("../Models/User.js");
const Review = require("../Models/Review.js");
const { protect } = require("../Middleware/auth.js");
const router = express.Router();

// Get user profile by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user profile (Protected)
router.get("/profile/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile (Protected)
router.put("/profile/update", protect, async (req, res) => {
  try {
    const { name, phone, bio, profilePicture, college } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        bio,
        profilePicture,
        college,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's reviews (as reviewee)
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.id })
      .populate("reviewer", "name profilePicture")
      .sort({ createdAt: -1 });

    if (!reviews) {
      return res.status(404).json({ message: "No reviews found" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create review for a user (Protected)
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const { rating, comment, listing } = req.body;

    // Validate input
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Please provide rating and comment" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if reviewer is trying to review themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      reviewer: req.user.id,
      reviewee: req.params.id,
      listing: listing,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({
          message: "You have already reviewed this user for this listing",
        });
    }

    // Create review
    const review = await Review.create({
      reviewer: req.user.id,
      reviewee: req.params.id,
      rating,
      comment,
      listing,
    });

    // Update user's rating
    const allReviews = await Review.find({ reviewee: req.params.id });
    const averageRating =
      allReviews.reduce((sum, rev) => sum + rev.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(req.params.id, {
      rating: averageRating,
      totalReviews: allReviews.length,
    });

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete review (Protected)
router.delete("/reviews/:reviewId", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user is the reviewer
    if (review.reviewer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    const revieweeId = review.reviewee;
    await Review.findByIdAndDelete(req.params.reviewId);

    // Update user's rating
    const allReviews = await Review.find({ reviewee: revieweeId });

    if (allReviews.length === 0) {
      await User.findByIdAndUpdate(revieweeId, {
        rating: 5,
        totalReviews: 0,
      });
    } else {
      const averageRating =
        allReviews.reduce((sum, rev) => sum + rev.rating, 0) /
        allReviews.length;

      await User.findByIdAndUpdate(revieweeId, {
        rating: averageRating,
        totalReviews: allReviews.length,
      });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search users
router.get("/search/query", async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: "Please provide search query" });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user account (Protected)
router.delete("/account/delete", protect, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Please provide password for confirmation" });
    }

    const user = await User.findById(req.user.id).select("+password");

    // Verify password
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
