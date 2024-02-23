require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connected successfully to MongoDB server");
  })
  .catch((err) => {
    console.error(err);
  });
