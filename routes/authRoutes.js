const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { signup, login } = require("../controllers/authController");
// POST /api/auth/register - Register a new user

router.post("/signup", signup);

// Login Route
router.post("/login", login);

module.exports = router;