const express = require("express");
const Trade = require("../models/Trade");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Today's trades
router.get("/trades/today", auth, admin, async (req, res) => {
  const now = new Date();
  const startUTC = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0, 0, 0, 0
  ));

  // End of today in UTC
  const endUTC = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    23, 59, 59, 999
  ));

const trades = await Trade.find({
  createdAt: { $gte: startUTC, $lte: endUTC }
}).populate("userId", "email");

res.json({ trades });
});

// All trades
router.get("/trades", auth, admin, async (req, res) => {
  const trades = await Trade.find()
    .sort({ createdAt: -1 })
    .populate("userId", "name email");

  res.json(trades);
});

module.exports = router;
