const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();

const validator = require("validator");
const mongoose = require("mongoose");

const imagesDirectory = path.join(__dirname, "images");

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connected successfully to MongoDB server");
  })
  .catch((err) => {
    console.error(err);
  });

const clientSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: String,
  lastName: String,
  country: String,
});
const Client = mongoose.model("clients", clientSchema);

app.use("/images", async (req, res, next) => {
  const imageName = req.path.split("/").pop();
  const { email, firstName, lastName, country } = req.query;

  if (!email || !firstName || !lastName || !country) {
    return res.status(400).send("Missing parameters");
  }

  if (!validator.isEmail(email)) {
    return res.status(400).send("Invalid email format");
  }

  console.log(`Email captured: ${email}`);
  console.log(`First Name: ${firstName}`);
  console.log(`Last Name: ${lastName}`);
  console.log(`Country: ${country}`);

  await saveEmailToDatabase({ email, firstName, lastName, country });

  next();
});

app.use("/images", express.static(imagesDirectory));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

async function saveEmailToDatabase({ email, firstName, lastName, country }) {
  try {
    const newClient = new Client({ email, firstName, lastName, country });
    const savedClient = await newClient.save();
    console.log("Email saved to database:", savedClient);
  } catch (error) {
    if (error.name === "ValidationError") {
      console.log("Validation Error:", error.message);
    } else if (error.name === "MongoError" && error.code === 11000) {
      console.log("Duplicate key error:", error.message);
    } else {
      console.log("Database error:", error.message);
    }
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
