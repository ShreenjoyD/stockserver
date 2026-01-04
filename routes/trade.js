const express = require("express");
const Trade = require("../models/Trade");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// BUY / SELL
router.post("/", auth, async (req, res) => {
  const { symbol, type, price, quantity } = req.body;

  const user = await User.findById(req.userId);
  const totalAmount = price * quantity;

  if (type === "BUY") {
    if (user.walletBalance < totalAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.walletBalance -= totalAmount;
  }

  if (type === "SELL") {
    user.walletBalance += totalAmount;
  }

  await user.save();

  const trade = await Trade.create({
    userId: user._id,
    symbol,
    type,
    price,
    quantity,
  });

  res.json({
    trade,
    walletBalance: user.walletBalance,
  });
});

// USER TRADE HISTORY
router.get("/", auth, async (req, res) => {
  const trades = await Trade.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(trades);
});

module.exports = router;
