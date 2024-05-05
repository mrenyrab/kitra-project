const User = require("../models/User");
const Treasure = require("../models/Treasure");
const MoneyValue = require("../models/MoneyValue");

const usersData = require("../sample_data/seedUsers");
const treasuresData = require("../sample_data/seedTreasures");
const moneyValuesData = require("../sample_data/seedMoneyValues");

module.exports.welcome = async (req, res) => {
  res.send("Hello, welcome to the API!");
};

module.exports.seedUsers = async (req, res) => {
  try {
    const createdUsers = [];

    for (const userData of usersData) {
      const { userId, name, age, password, email } = userData;

      // Validation
      if (!userId || !name || !age || !password || !email) {
        return res
          .status(400)
          .json({ status: 400, message: "All fields are required." });
      }

      // Check if user with email already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          status: 400,
          message: `User with email ${email} already exists.`,
        });
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
      createdUsers.push(newUser);
    }

    return res.status(201).json({
      status: 201,
      message: "Users registered successfully.",
      users: createdUsers,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error." });
  }
}; // End of seedUsers

module.exports.seedTreasures = async (req, res) => {
  try {
    const createdTreasures = [];

    for (const treasureData of treasuresData) {
      const { treasureId, latitude, longitude, name } = treasureData;

      // Validation
      if (!treasureId || !latitude || !longitude || !name) {
        return res
          .status(400)
          .json({ status: 400, message: "All fields are required." });
      }

      // Check if treasure with name already exists
      const existingTreasure = await Treasure.findOne({ name });

      if (existingTreasure) {
        return res.status(400).json({
          status: 400,
          message: `Treasures with name ${name} already exists.`,
        });
      }

      // Create new treasure
      const newTreasure = new Treasure({
        treasureId,
        latitude,
        longitude,
        name,
      });

      // Save treasure to database
      await newTreasure.save();
      createdTreasures.push(newTreasure);
    }

    return res.status(201).json({
      status: 201,
      message: "Treasure added successfully.",
      treasures: createdTreasures,
    });
  } catch (error) {
    console.error("Adding treasures error:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error." });
  }
}; // End of seedTreasures

module.exports.seedMoneyValues = async (req, res) => {
  try {
    const createdMoneyValues = [];

    for (const moneyValueData of moneyValuesData) {
      const { treasureId, amount } = moneyValueData;

      // Validation
      if (!treasureId || !amount) {
        return res
          .status(400)
          .json({ status: 400, message: "All fields are required." });
      }

      // Create new moneyValue
      const newMoneyValue = new MoneyValue({
        treasureId,
        amount,
      });

      // Save money value to database
      await newMoneyValue.save();
      createdMoneyValues.push(newMoneyValue);
    }

    return res.status(201).json({
      status: 201,
      message: "Money values added successfully.",
      treasures: createdMoneyValues,
    });
  } catch (error) {
    console.error("Adding money values error:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error." });
  }
}; // End of seedMoneyValues
