const express = require("express");
const {
  createPayment,
  confirmPayment,
  getMyPayments,
  getAllPayments,
} = require('./payment.controller')
const { create } = require("./payment.model");
const auth = require("../../middleware/auth");
const USER_ROLE = require("../user/user.constant");
const router = express.Router();

// Create Payment
router.post("/create-payment", createPayment);

// Capture Payment
router.post("/confirm-payment", confirmPayment)

router.get("/my-payments", auth(USER_ROLE.user), getMyPayments);
router.get("/", auth(USER_ROLE.admin), getAllPayments);

const paymentRouter = router;
module.exports = paymentRouter;
