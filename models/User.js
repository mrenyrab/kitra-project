const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User id is required"],
  },

  name: {
    type: String,
    required: [true, "Name is required"],
  },

  age: {
    type: Number,
    required: [true, "Age is required"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
  },
});

module.exports = mongoose.model("User", userSchema);
