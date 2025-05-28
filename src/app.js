const express = require("express");
const app = express();
const cors = require("cors");
const notFound = require("./middleware/notFound");

app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/", (req, res) => {
  return res.send("Your server is running!");
});

app.use(notFound);

module.exports = app;
