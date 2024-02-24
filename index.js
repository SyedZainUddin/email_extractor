const express = require("express");
const app = express();
require("dotenv").config();
 const connection = require("./connection");
const apiRoutes = require("./route");

app.use(apiRoutes);

app.use((err, req, res) => {
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
