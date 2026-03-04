const mongoose = require("mongoose");

const LostItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  place: { type: String, required: true },
  lostDate: Date,
  desc: String,
  contactName: String,
  contactPhone: String,
  userAddress: String,
  image: String,
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
});

module.exports = mongoose.model("LostItem", LostItemSchema);
