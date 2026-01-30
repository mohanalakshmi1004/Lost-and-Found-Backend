const mongoose = require("mongoose");

const FoundItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  place: { type: String, required: true },
  foundDate: Date,
  desc: String,
  contactName: String,
  contactPhone: String,
  userAddress: String,
  image: String
});

module.exports = mongoose.model("FoundItem", FoundItemSchema);
