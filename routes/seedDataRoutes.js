const express = require("express");
const seedDataController = require("../controllers/seedDataController");

// Routing component
const router = express.Router();

router.get("/", seedDataController.welcome);

// Route for seeding users
router.post("/seed-user", seedDataController.seedUsers);

// Route for seeding treasures
router.post("/seed-treasures", seedDataController.seedTreasures);

// Route for seeding money values
router.post("/seed-money-values", seedDataController.seedMoneyValues);

module.exports = router;
