const express = require("express");
const app = express();
const cors = require("cors");
const notFound = require("./middleware/notFound");
const router = require("./router");
const globalErrorHandler = require("./middleware/globalErrorHandler");

app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api", router);

app.use("/", (req, res) => {
  return res.send("Your server is running!");
});

app.use(globalErrorHandler);
app.use(notFound);

module.exports = app;
