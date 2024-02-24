const express = require("express");
const Client = require("./schema");
const validator = require("validator");
const path = require("path");

const imagesDirectory = path.join(__dirname, "images");

const router = express.Router();

router.use("/images", async (req, res, next) => {
  const { email, firstName, lastName, country } = req.query;
  console.log(email, firstName, lastName, country);

  try {
    if (!email || !validator.isEmail(email)) {
      return res.status(400).send("Invalid email format");
    }

    const existingClient = await Client.findOne({ email });

    if (!existingClient) {
      const newClientData = { email };

      // Add optional fields if they exist
      if (firstName) newClientData.firstName = firstName;
      if (lastName) newClientData.lastName = lastName;
      if (country) newClientData.country = country;

      const newClient = new Client(newClientData);
      const savedClient = await newClient.save();

      console.log("Email saved to database:", savedClient);
    } else {
      console.log("Email already exists:", existingClient);
    }

    // Return success response with static images
    return express.static(imagesDirectory)(req, res, next);
  } catch (error) {
    // Pass error to global error handler middleware
    next(error);
  }
});

module.exports = router;
