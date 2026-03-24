require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log(" MongoDB Error:", err.message));

// Routes
app.use("/api/auth", require("./Routes/auth.js"));
app.use("/api/listings", require("./Routes/listings.js"));
app.use("/api/users", require("./Routes/users.js"));
app.use("/api/messages", require("./Routes/messages.js"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware (MUST BE LAST with 4 parameters)
app.use((err, req, res, next) => {
  console.error(" Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
