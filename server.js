const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const authMiddleWare = require('./utils/authMiddleware.js')
require("dotenv").config();

const app = express()
// frontend url(s) configurable via env
// sanitize FRONTEND_URL so no trailing slash remains
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/+$/g, "");
// support additional origins such as localhost during development
const CORS_WHITELIST = [FRONTEND_URL, "http://localhost:3000"].filter(Boolean);

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // allow non-browser requests like curl/postman
    if (!origin) return callback(null, true);
    if (CORS_WHITELIST.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // origin not recognized -> do not set header
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// log for debugging
console.log("CORS whitelist:", CORS_WHITELIST);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true })); 

// Routes
app.use("/api/lost", require("./routes/lostRoutes"));
app.use("/api/found", require("./routes/foundRoutes"));

app.use("/api/auth", authRoutes);


// Health check route
app.get("/", (req, res) => {
  res.send("Lost & Found API is running ✅");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
