const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const LostItem = require("../models/LostItem");

// GET all lost items
router.get("/", async (req, res) => {
  try {
    const items = await LostItem.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching lost items:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST a new lost item
router.post("/", async (req, res) => {
  try {
    const newItem = new LostItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Error adding lost item:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE lost item by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Delete lost item request:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const deletedItem = await LostItem.findByIdAndDelete(id);
  if (!deletedItem) {
    return res.status(404).json({ message: "Lost item not found" });
  }

  res.json({ message: "Lost item deleted successfully" });
});

module.exports = router;
