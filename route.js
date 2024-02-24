const express = require("express");
const Client = require("./schema");
const validator = require("validator");
const path = require("path");

const imagesDirectory = path.join(__dirname, "images");

const router = express.Router();

router.use("/images", async (req, res, next) => {
  const imageName = req.path.split("/").pop();
  const { email, firstName, lastName, country } = req.query;
console.log(email, firstName, lastName, country)
  if (!email || !firstName || !lastName || !country) {
    return express.static(imagesDirectory)(req, res, next);
  }

  if (!validator.isEmail(email)) {
    return express.static(imagesDirectory)(req, res, next);
  }

  try {
    // Check if the email already exists in the database
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      console.log("Email already exists", existingClient);
      return express.static(imagesDirectory)(req, res, next);
    }

    // If the email is unique, save the client
    const newClient = new Client({ email, firstName, lastName, country });
    const savedClient = await newClient.save();
    console.log("Email saved to database:", savedClient);

    express.static(imagesDirectory)(req, res, next);
  } catch (error) {
    express.static(imagesDirectory)(req, res, next);
    if (error) {
      console.log("Validation Error:", error.message);
      // Handle other types of errors as needed
    }
  }
});

module.exports = router;
