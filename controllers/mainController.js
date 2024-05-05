const User = require("../models/User");
const Treasure = require("../models/Treasure");
const MoneyValue = require("../models/MoneyValue");

module.exports.findTreasures = async (req, res) => {
  try {
    const { latitude, longitude, distance } = req.body;

    // Ensure latitude and longitude are parsed as numbers
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);

    // Calculate the conversion factor for kilometers to degrees
    const conversionFactor = 111.32; // Approximately 111.32 kilometers in one degree of latitude or longitude

    // Calculate the range of latitude and longitude for the given distance
    const latRange = distance / conversionFactor;
    const lonRange =
      distance /
      (conversionFactor * Math.cos(parsedLatitude * (Math.PI / 180)));

    // Query to find treasures within the specified latitude and longitude range
    const treasures = await Treasure.find({
      latitude: {
        $gte: parsedLatitude - latRange,
        $lte: parsedLatitude + latRange,
      },
      longitude: {
        $gte: parsedLongitude - lonRange,
        $lte: parsedLongitude + lonRange,
      },
    });

    const treasuresWithAmount = [];

    // Check if any treasures were found
    if (treasures.length === 0) {
      return res.status(404).json({ message: "No treasures found" });
    }

    for (const treasure of treasures) {
      const { treasureId } = treasure;

      const moneyValue = await MoneyValue.find({ treasureId });

      if (moneyValue) {
        treasuresWithAmount.push({ ...treasure._doc, moneyValue });
      }
    }

    res.status(200).json({ treasuresWithAmount });
  } catch (error) {
    console.error("Error finding treasures:", error);
    // Send an error response
    res.status(500).json({ error: "Internal server error" });
  }
}; // End of findTreasures

module.exports.findTreasuresByValue = async (req, res) => {
  res.send("Hello, welcome to the find treasures by value!");
}; // End of findTreasuresByValue
