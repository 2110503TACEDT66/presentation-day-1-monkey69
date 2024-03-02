const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { route } = require("./routes/bookings");

dotenv.config({ path: "./config/config.env" });

connectDB();

//Route file
const booking = require("./routes/bookings");

const app = express();

app.use(express.json());

app.use("/api/v1/bookings", booking);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log("Server running in ", process.env.NODE_ENV, " mode on port", PORT)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});