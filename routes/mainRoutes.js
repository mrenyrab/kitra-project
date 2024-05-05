const express = require("express");
const mainController = require("../controllers/mainController");

// Routing component
const router = express.Router();

// Route for finding treasures
router.get("/find-treasures", mainController.findTreasures);

// Route for finding treasures by value
router.get("/find-treasures-by-value", mainController.findTreasuresByValue);

module.exports = router;
