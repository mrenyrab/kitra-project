const mongoose = require("mongoose");

const moneyValueSchema = new mongoose.Schema({
  treasureId: {
    type: String,
    required: [true, "Treasure id is required"],
  },

  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
});

module.exports = mongoose.model("MoneyValue", moneyValueSchema);
