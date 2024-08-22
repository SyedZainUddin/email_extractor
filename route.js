const express = require("express");
const Client = require("./schema");
const validator = require("validator");
const path = require("path");

const imagesDirectory = path.join(__dirname, "images");

const router = express.Router();



const axios = require('axios');

// Replace with your IPAPI access key if you have one
const IPAPI_URL = 'https://ipapi.co';

const getCountryFromIP = async (ip) => {
  try {
    const response = await axios.get(`${IPAPI_URL}/${ip}/json/`);
    return response.data.country_name;
  } catch (error) {
    console.error('Error fetching country information:', error);
    throw new Error('Unable to fetch country information.');
  }
};

router.use("/images", async (req, res, next) => {
  const { email, firstName, lastName } = req.query;
  // console.log(email, firstName, lastName, country);
  const ip = req.ip
  const country = await getCountryFromIP(ip);
  console.log(country)
  try {
    // if (!email || !validator.isEmail(email)) {
    //   return res.status(400).send("Invalid email format");
    // }
    if (email) {

      const existingClient = await Client.findOne({ email });

      if (!existingClient) {
        const newClientData = { email, ip };

        // Add optional fields if they exist
        // if (firstName) newClientData.firstName = firstName;
        // if (lastName) newClientData.lastName = lastName;
        // if (country) newClientData.country = country;

        const newClient = new Client(newClientData);
        const savedClient = await newClient.save();

        // console.log("Email saved to database:", savedClient);
      } else {
        console.log("Email already existss")
      }
    }

    // Return success response with static images
    return express.static(imagesDirectory)(req, res, next);
  } catch (error) {
    // Pass error to global error handler middleware
    next(error);
  }
});

router.get("/clients", async (req, res, next) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    next(error);
  }
});

router.get("/emails", async (req, res, next) => {
  try {
    // Fetch all clients from the database
    const clients = await Client.find();

    // Extract email addresses from clients and create an array
    const emails = clients.map(client => client.email);

    // Return the array of email addresses as JSON response
    res.json(emails);
  } catch (error) {
    // Pass any errors to the global error handler middleware
    next(error);
  }
});

module.exports = router;
