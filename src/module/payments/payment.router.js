const express = require("express");
const {
  createPayment,
  capturePayment,
  getMyPayments,
  getAllPayments,
} = require("./payment.controller");
const { create } = require("./payment.model");
const auth = require("../../middleware/auth");
const USER_ROLE = require("../user/user.constant");
const router = express.Router();

// Create Payment
router.post("/create-payment", createPayment);

// Capture Payment
router.post("/capture-payment", capturePayment);
router.get("/my-payments", auth(USER_ROLE.user), getMyPayments);
router.get("/", auth(USER_ROLE.admin), getAllPayments);

const paymentRouter = router;
module.exports = paymentRouter;
