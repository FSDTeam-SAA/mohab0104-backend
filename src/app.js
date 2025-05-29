const express = require("express");
const app = express();
const cors = require("cors");
const notFound = require("./middleware/notFound");
const router = require("./router");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const cookieParser = require("cookie-parser");

app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/v1/api", router);

app.use("/", (req, res) => {
  return res.send("Your server is running!");
});

app.use(globalErrorHandler);
app.use(notFound);

module.exports = app;
