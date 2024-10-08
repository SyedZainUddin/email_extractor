const express = require("express");
const Client = require("./schema");
const validator = require("validator");
const path = require("path");

const imagesDirectory = path.join(__dirname, "images");

const router = express.Router();



const axios = require('axios');

// Replace with your IPAPI access key if you have one
const IPAPI_URL = 'https://ipapi.co';

 

router.use("/images", async (req, res, next) => {
  const { email, firstName, lastName, country, contect } = req.query;
  console.log(email, firstName, lastName, country, contect, "body");
  const ip =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.headers['cg-connecting-ip'] ||
    req.socket.remoteAddress
      
  try {
    // if (!email || !validator.isEmail(email)) {
    //   return res.status(400).send("Invalid email format");
    // }
    if (email) {

      const existingClient = await Client.findOne({ email });

      if (!existingClient) {
        const newClientData = { email, ip };

        // Add optional fields if they exist
        if (firstName) newClientData.firstName = firstName;
        if (lastName) newClientData.lastName = lastName;
        if (country) newClientData.country = country;
        if (contect) newClientData.contect = contect;


        const newClient = new Client(newClientData);
        console.log(newClient, "new client")
        const savedClient = await newClient.save();

        console.log("Email saved to database:", savedClient);
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
