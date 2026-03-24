const express = require("express");
const mongoose = require("mongoose");
const Message = require("../Models/Message.js");
const User = require("../Models/User.js");
const { protect } = require("../Middleware/auth.js");
const router = express.Router();

// Get all conversations for current user
router.get("/conversations", protect, async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user.id);

    // Find all unique conversations
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserId },
            { receiver: currentUserId },
          ],
        },
      },
      {
        $sort: { createdAt: 1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", currentUserId] }, "$receiver", "$sender"],
          },
          lastMessage: { $last: "$message" },
          lastMessageTime: { $last: "$createdAt" },
          unread: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$sender", currentUserId] },
                    { $eq: ["$read", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    // Populate user details
    const populatedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const user = await User.findById(conv._id).select(
          "name profilePicture email",
        );
        return {
          userId: conv._id,
          user,
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime,
          unread: conv.unread,
        };
      }),
    );

    res.status(200).json(populatedConversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unread message count (Protected)
router.get("/unread/count", protect, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiver: req.user.id,
      read: false,
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages for a specific listing (for buyers/sellers)
router.get("/listing/:listingId", protect, async (req, res) => {
  try {
    const { listingId } = req.params;

    const messages = await Message.find({
      listing: listingId,
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate("sender", "name profilePicture")
      .populate("receiver", "name profilePicture")
      .populate("listing", "title price")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages between two users
router.get("/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    })
      .populate("sender", "name profilePicture")
      .populate("receiver", "name profilePicture")
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user.id,
        read: false,
      },
      { read: true },
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message (Protected)
router.post("/send/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { message, listing } = req.body;

    // Validate input
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Please provide a message" });
    }

    // Check if receiver exists
    const receiver = await User.findById(userId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Prevent messaging yourself
    if (req.user.id === userId) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }

    // Create message
    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: userId,
      message: message.trim(),
      listing: listing || null,
    });

    // Populate sender and receiver info
    await newMessage.populate("sender", "name profilePicture");
    await newMessage.populate("receiver", "name profilePicture");

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark message as read (Protected)
router.put("/:messageId/read", protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user is the receiver
    if (message.receiver.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to mark this message as read" });
    }

    message.read = true;
    await message.save();

    res.status(200).json({ message: "Message marked as read", data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete message (Protected)
router.delete("/:messageId", protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user is sender or receiver
    if (
      message.sender.toString() !== req.user.id &&
      message.receiver.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this message" });
    }

    await Message.findByIdAndDelete(req.params.messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
