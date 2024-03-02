const express = require("express");
const dotenv = require("dotenv");
const dentists = require("./routes/dentists");
const { connect } = require("mongoose");
const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

//connect to Mongo
connectDB();

const app = express(express.json());

app.use("/api/v1/dentists", dentists);

const PORT = process.env.PORT || 5000;
app.listen(PORT,console.log("Server running in ", process.env.NODE_ENV, " mode on port", PORT));
