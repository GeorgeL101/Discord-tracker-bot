const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  savedWins: { type: Number, default: 0 }, // Ensure savedWins is a number with a default of 0
  rank: { type: String, default: "Bronze" },
  kdValue: { type: Number, default: 0 }, // Kill/Death Ratio
});

const User = mongoose.model("User", userSchema);

module.exports = User;
