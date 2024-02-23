const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const Client = require("./schema");
const connect = require("./connection");
const validator = require("validator");

const imagesDirectory = path.join(__dirname, "images");

app.use("/images", async (req, res, next) => {
  const imageName = req.path.split("/").pop();
  const { email, firstName, lastName, country } = req.query;

  if (!email || !firstName || !lastName || !country) {
    return express.static(imagesDirectory)(req, res, next);
  }

  if (!validator.isEmail(email)) {
    return express.static(imagesDirectory)(req, res, next);
  }

  try {
    const newClient = new Client({ email, firstName, lastName, country });
    const savedClient = await newClient.save();
    console.log("Email saved to database:", savedClient);

    express.static(imagesDirectory)(req, res, next);
  } catch (error) {
    express.static(imagesDirectory)(req, res, next);
    if (error) {
      console.log("Validation Error:", error.message);
    }
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
