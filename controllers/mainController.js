const User = require("../models/User");
const Treasure = require("../models/Treasure");
const MoneyValue = require("../models/MoneyValue");
const auth = require("../auth");

module.exports.login = async (req, res) => {
  try {
    const result = await User.findOne({ email: req.body.email });

    if (!result) {
      return res.status(400).json({ status: 400, message: "User not found" });
    } else {
      const isPasswordCorrect = req.body.password === result.password;

      if (isPasswordCorrect) {
        return res.status(201).json({
          status: 201,
          id: result._id,
          access: auth.createAccessToken(result),
        });
      } else {
        return res
          .status(404)
          .json({ status: 404, message: "Incorrect password. Try again." });
      }
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
}; // End of login

module.exports.register = async (req, res) => {
  try {
    const { userId, name, age, password, email } = req.body;

    if (!userId || !name || !age || !password || !email) {
      return res
        .status(404)
        .json({ status: 404, message: "All fields are required." });
    }

    // Check email if already exists
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res
        .status(404)
        .json({ status: 404, message: "Email already exists. Try again." });
    }

    // Create new user
    const newUser = new User({
      userId,
      name,
      age,
      password,
      email,
    });

    // Save user to database
    await newUser.save();

    // Return success response with status 201 (Created)
    return res
      .status(201)
      .json({ status: 201, message: "User registered successfully." });
  } catch (error) {
    console.error(error);
  }
}; // End of register

module.exports.findTreasures = async (req, res) => {
  try {
    const { latitude, longitude, distance } = req.body;

    // Only accepts distance 1 or 10
    if (distance !== 1 && distance !== 10) {
      return res
        .status(404)
        .json({ status: 404, message: "Distance should be 1 or 10" });
    }

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

    const treasuresFound = [];

    // Check if any treasures were found
    if (treasures.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "No treasures found" });
    }

    for (const treasure of treasures) {
      const { treasureId } = treasure;

      // Get the value of a treasure box according to treasureId
      const moneyValue = await MoneyValue.find({ treasureId });

      // add moneyValue property to treasure object
      if (moneyValue) {
        treasuresFound.push({ ...treasure._doc, moneyValue });
      }
    } //  End of for loop

    res.status(200).json({ treasuresFound });
  } catch (error) {
    console.error("Error finding treasures:", error);
    // Send an error response
    res.status(500).json({ error: "Internal server error" });
  }
}; // End of findTreasures

module.exports.findTreasuresByValue = async (req, res) => {
  try {
    const { latitude, longitude, distance, price_value } = req.body;

    // Only accepts distance 1 or 10
    if (distance !== 1 && distance !== 10) {
      return res
        .status(404)
        .json({ status: 404, message: "Distance should be 1 or 10" });
    }

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

    const treasuresFound = [];

    // Check if any treasures were found
    if (treasures.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "No treasures found" });
    }

    // If no price_value provided
    if (!price_value) {
      for (const treasure of treasures) {
        const { treasureId } = treasure;

        // Get the value of a treasure box according to treasureId
        const moneyValues = await MoneyValue.find({ treasureId });

        if (moneyValues.length > 0) {
          // add moneyValue property to treasure object
          treasuresFound.push({ ...treasure._doc, moneyValues });
        }
      } // End of for loop

      return res.status(201).json({ status: 201, treasuresFound });
    } // End of if statement

    // If price value is not a whole number
    if (price_value % 1 !== 0) {
      return res.status(404).json({
        status: 404,
        message: "Please enter whole number for price value",
      });
    } // End of if statement

    /* Lines below executes if price value is provided */
    for (const treasure of treasures) {
      const { treasureId } = treasure;

      // Get the value of a treasure box according to treasureId
      const moneyValues = await MoneyValue.find({ treasureId });

      if (moneyValues.length > 0) {
        // Sort money values in ascending order to get the minimum money value
        moneyValues.sort((a, b) => a.value - b.value);

        // Push the treasure with the minimum money value only
        treasuresFound.push({ ...treasure._doc, moneyValue: moneyValues[0] });
      }
    } // End of for loop

    // Filter treasures more than $10 and maximum of price_value
    const filteredTreasures = treasuresFound.filter((treasure) => {
      return treasure.moneyValue.amount === price_value;
    });

    // Check if any treasures were found
    if (filteredTreasures.length === 0) {
      return res
        .status(404)
        .json({ message: "No treasures found at that price value" });
    }

    res.status(201).json({ filteredTreasures });
  } catch (error) {
    console.error("Error finding treasures:", error);
    // Send an error response
    res.status(500).json({ status: 500, error: "Internal server error" });
  }
}; // End of findTreasuresByValue
