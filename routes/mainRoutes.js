const express = require("express");
const mainController = require("../controllers/mainController");
const auth = require("../auth");
const { verify } = auth;

// Routing component
const router = express.Router();

// Route for login
router.post("/login", mainController.login);

// Route for register
router.post("/register", mainController.register);

// Route for add treasures
router.post("/add-treasure", verify, mainController.addTreasure);

// Route for add moneyValue
router.post("/add-money-value", verify, mainController.addMoneyValue);

// Route for finding treasures
router.get("/find-treasures", verify, mainController.findTreasures);

// Route for finding treasures by value
router.get(
  "/find-treasures-by-value",
  verify,
  mainController.findTreasuresByValue
);

module.exports = router;
