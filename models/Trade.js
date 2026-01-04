const mongoose = require("mongoose");

const TradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symbol: String,
  type: { type: String, enum: ["BUY", "SELL"] },
  price: Number,
  quantity: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trade", TradeSchema);
