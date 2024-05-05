const express = require("express");
const mongoose = require("mongoose");
const port = 4000;
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Allows our backend application to be available to our frontend application

const seedDataRoutes = require("./routes/seedDataRoutes");
const mainRoutes = require("./routes/mainRoutes");

// Database connection
// Connect to our MongoDB database
mongoose.connect(
  "mongodb+srv://enyrab123:mr3nyr4b01@b297.riaw3aa.mongodb.net/kitra_db?retryWrites=true&w=majority&appName=B297"
);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => console.log("Connected to MongoDB Atlas."));

// [Backend routes]
// http://localhost:4000/users
app.use("/seed", seedDataRoutes);
app.use("/main", mainRoutes);

// Server gateway response
if (require.main === module) {
  app.listen(process.env.PORT || port, () => {
    console.log(`API is now online on port ${process.env.PORT || port}`);
  });
}

module.exports = { app, mongoose };
