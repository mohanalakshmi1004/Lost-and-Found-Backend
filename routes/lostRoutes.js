const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const LostItem = require("../models/LostItem");
const authMiddleware = require("../utils/authMiddleware");

// GET ONLY lost items belonging to the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    // req.user.id is populated by your authMiddleware from the JWT token
    const items = await LostItem.find({ userId: req.user.id }); 
    res.json(items);
  } catch (err) {
    console.error("Error fetching lost items:", err);
    res.status(500).json({ error: err.message });
  }
});

// return all lost items (authenticated) -- useful for matching or admin views
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const items = await LostItem.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching all lost items:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST a new lost item and link it to the current user
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Create the item data and explicitly attach the userId from the token
    const itemData = {
      ...req.body,
      userId: req.user.id 
    };
    const newItem = new LostItem(itemData);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Error adding lost item:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE lost item by ID (Security: check if it belongs to the user)
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // Ensure the user can only delete their OWN items
    const deletedItem = await LostItem.findOneAndDelete({ _id: id, userId: req.user.id });
    
    if (!deletedItem) {
      return res.status(404).json({ message: "Lost item not found or unauthorized" });
    }

    res.json({ message: "Lost item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;