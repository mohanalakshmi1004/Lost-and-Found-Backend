const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const FoundItem = require("../models/FoundItem");

// GET all found items
router.get("/", async (req, res) => {
  try {
    const items = await FoundItem.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching found items:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST a new found item
router.post("/", async (req, res) => {
  try {
    const newItem = new FoundItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Error adding found item:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE found item by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Delete found item request:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const deletedItem = await FoundItem.findByIdAndDelete(id);
  if (!deletedItem) {
    return res.status(404).json({ message: "Found item not found" });
  }

  res.json({ message: "Found item deleted successfully" });
});

module.exports = router;
