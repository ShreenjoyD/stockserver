const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  walletBalance: {
    type: Number,
    default: 100000, // starting balance ₹1,00,000
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

module.exports = mongoose.model("User", UserSchema);
