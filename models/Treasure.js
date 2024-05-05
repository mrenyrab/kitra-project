const mongoose = require("mongoose");

const treasureSchema = new mongoose.Schema({
  treasureId: {
    type: String,
    required: [true, "Treasure id is required"],
  },

  latitude: {
    type: Number,
    required: [true, "Latitude is required"],
  },

  longitude: {
    type: Number,
    required: [true, "Longitude is required"],
  },

  name: {
    type: String,
    required: [true, "Name is required"],
  },
});

module.exports = mongoose.model("Treasure", treasureSchema);
