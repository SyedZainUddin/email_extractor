const express = require("express");
const Client = require("./schema");
const validator = require("validator");
const path = require("path");
const geoip = require("geoip-lite");

const imagesDirectory = path.join(__dirname, "images");

const router = express.Router();

router.use("/images", async (req, res, next) => {
  const { email, firstName, lastName, country } = req.query;

  // Get the correct IP address of the requester
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.remoteAddress;
console.log("192.168.0.107")
  // Get geo information based on IP address
  const geo = geoip.lookup("192.168.0.107");

  try {
    if (email) {
      const existingClient = await Client.findOne({ email });

      if (!existingClient) {
        const newClientData = { email };

        // // Add optional fields if they exist
        // if (firstName) newClientData.firstName = firstName;
        // if (lastName) newClientData.lastName = lastName;
        // if (country) newClientData.country = country;

        const newClient = new Client(newClientData);
        const savedClient = await newClient.save();

        console.log("Email saved to database:", savedClient);
      } else {
        console.log("Email already exists:", existingClient);
      }
    }

    // Log IP address and country code
    console.log(`Request IP: ${ip}, Country: ${geo}`);

    // Return success response with static images
    return express.static(imagesDirectory)(req, res, next);
  } catch (error) {
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
    const clients = await Client.find();
    const emails = clients.map(client => client.email);
    res.json(emails);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
