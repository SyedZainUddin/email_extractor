const express = require("express");
const app = express();
require("dotenv").config();
const connection = require("./connection");
const apiRoutes = require("./route");
app.set('trust proxy', true)

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

// Force geoip-lite to download its data files

app.use(apiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.get("/", async (req, res) => {
  const ip = req.ip
  const country = await getCountryFromIP(ip);
  console.log(country)

  res.send({ message: `Server is running on IP: ${ip}`, country: country });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
