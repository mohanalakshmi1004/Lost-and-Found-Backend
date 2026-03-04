const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const FoundItem = require("../models/FoundItem");
const authMiddleware = require("../utils/authMiddleware");

// GET ONLY found items belonging to the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await FoundItem.find({ userId: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public (authenticated) endpoint returning every found item in the database.
// Used by profile/matches logic to match against other users' reports.
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const items = await FoundItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new found item linked to user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const itemData = { ...req.body, userId: req.user.id };
    const newItem = new FoundItem(itemData);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE found item
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await FoundItem.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedItem) return res.status(404).json({ message: "Not found or unauthorized" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;