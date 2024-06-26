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
}; // End of register\

module.exports.addTreasure = async (req, res) => {
  try {
    const { treasureId, latitude, longitude, name } = req.body;

    if (!treasureId || !latitude || !longitude || !name) {
      return res
        .status(404)
        .json({ status: 404, message: "All fields are required." });
    }

    if (typeof latitude === "string" || typeof longitude === "string") {
      return res
        .status(404)
        .json({ status: 404, message: "Longitude should not contain string." });
    }

    // Check email if already exists
    const existingTreasure = await Treasure.findOne({
      treasureId: req.body.treasureId,
    });

    if (existingTreasure) {
      return res
        .status(404)
        .json({ status: 404, message: "Treasure already exists. Try again." });
    }

    // Create new user
    const newTreasure = new Treasure({
      treasureId,
      latitude,
      longitude,
      name,
    });

    // Save user to database
    await newTreasure.save();

    // Return success response with status 201 (Created)
    return res
      .status(201)
      .json({ status: 201, message: "Treasure added successfully." });
  } catch (error) {
    console.error("Error adding treasure:", error);
    // Send an error response
    res.status(500).json({ error: "Internal server error" });
  }
}; //End of addTreasure

module.exports.addMoneyValue = async (req, res) => {
  try {
    const { treasureId, amount } = req.body;

    if (!treasureId || !amount) {
      return res
        .status(404)
        .json({ status: 404, message: "All fields are required." });
    }

    if (typeof amount === "string") {
      return res
        .status(404)
        .json({ status: 404, message: "Amount should not contain string." });
    }

    // Create new user
    const newMoneyValue = new MoneyValue({
      treasureId,
      amount,
    });

    // Save user to database
    await newMoneyValue.save();

    // Return success response with status 201 (Created)
    return res
      .status(201)
      .json({ status: 201, message: "Money value added successfully." });
  } catch (error) {
    console.error("Error adding money value:", error);
    // Send an error response
    res.status(500).json({ error: "Internal server error" });
  }
}; //End of addMoneyValue

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

    // Calculate the range of latitude and longitude from the given distance
    const latRange = distance / conversionFactor;
    const lonRange =
      distance /
      (conversionFactor * Math.cos(parsedLatitude * (Math.PI / 180)));

    /* 
      Find treasures in the specified latitude and longitude 
      within specified distance and then joins the prizes document 
      to treasure document
    */
    const treasures = await Treasure.aggregate([
      {
        $match: {
          // Checks if treasure is within the given distance
          latitude: {
            $gte: parsedLatitude - latRange,
            $lte: parsedLatitude + latRange,
          },
          longitude: {
            $gte: parsedLongitude - lonRange,
            $lte: parsedLongitude + lonRange,
          },
        },
      },
      {
        // Join the prizes document to treasure document
        $lookup: {
          from: "moneyvalues",
          localField: "treasureId",
          foreignField: "treasureId",
          as: "prizes",
        },
      },
    ]);

    // Check if no treasures were found
    if (treasures.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "No treasures found" });
    }

    res.status(201).send({ treasures });
  } catch (error) {
    console.error("Error finding treasures:", error);
    // Send an error response
    res.status(500).json({ error: "Internal server error" });
  }
}; // End of findTreasures

module.exports.findTreasuresByValue = async (req, res) => {
  try {
    const { latitude, longitude, distance, prize_value } = req.body;

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

    // If no prize provided
    if (!prize_value) {
      /* 
      Find treasures within the specified latitude and longitude 
      within specified distance and then joins the prizes document 
      to treasure document
    */
      const allTreasures = await Treasure.aggregate([
        {
          // Checks if treasure is within the given distance
          $match: {
            latitude: {
              $gte: parsedLatitude - latRange,
              $lte: parsedLatitude + latRange,
            },
            longitude: {
              $gte: parsedLongitude - lonRange,
              $lte: parsedLongitude + lonRange,
            },
          },
        },
        {
          // Join the prizes document to treasure document
          $lookup: {
            from: "moneyvalues",
            localField: "treasureId",
            foreignField: "treasureId",
            as: "prizes",
          },
        },
      ]);

      // Check if any treasures were found
      if (allTreasures.length === 0) {
        return res
          .status(404)
          .json({ status: 404, message: "No treasures found" });
      }

      res.status(201).send({ allTreasures });
    } // End of if statement

    // If prize value is not a whole number
    if (prize_value % 1 !== 0) {
      return res.status(404).json({
        status: 404,
        message: "Please provide whole number for prize value",
      });
    } else if (!(prize_value >= 10 && prize_value <= 30)) {
      // Checks if prize value is within 10-30
      return res.status(404).json({
        status: 404,
        message: "Please provide prize value 10-30 only",
      });
    }

    /* 
    Lines below executes if prize value is provided 
    - Find treasures in the specified latitude and longitude within specified distance
    - Filter the treasure that matches the specified prize_value
    - Join the prize collection into the treasure collection
    */
    const treasures = await Treasure.aggregate([
      {
        // Checks if treasure is within the given distance
        $match: {
          latitude: {
            $gte: parsedLatitude - latRange,
            $lte: parsedLatitude + latRange,
          },
          longitude: {
            $gte: parsedLongitude - lonRange,
            $lte: parsedLongitude + lonRange,
          },
        },
      },
      {
        // Joins the prizes document
        $lookup: {
          from: "moneyvalues",
          localField: "treasureId",
          foreignField: "treasureId",
          as: "prizes",
        },
      },
      {
        $unwind: "$prizes", // Unwind/deconstruct prizes array
      },
      {
        $sort: { "prizes.amount": 1 }, // Sort prizes in asc based on amount field
      },
      {
        $group: {
          _id: "$_id",
          treasureId: { $first: "$treasureId" },
          name: { $first: "$name" },
          latitude: { $first: "$latitude" },
          longitude: { $first: "$longitude" },
          prizes: { $first: "$prizes" }, // Get only the first element / get the minimum value
        },
      },
    ]);

    // Filter treasures that matches the prize value
    const filteredTreasures = treasures.filter((treasure) => {
      return treasure.prizes.amount === prize_value;
    });

    // Check if any treasures were found
    if (filteredTreasures.length === 0) {
      return res
        .status(404)
        .json({ message: "No treasures found at that prize value" });
    }

    res.status(201).json({ filteredTreasures });
  } catch (error) {
    console.error("Error finding treasures:", error);
    // Send an error response
    res.status(500).json({ status: 500, error: "Internal server error" });
  }
}; // End of findTreasuresByValue
