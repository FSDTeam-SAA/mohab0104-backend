const express = require("express");
const {
  createPayment,
  confirmPayment,
  getMyPayments,
  getAllPayments,
  getMonthlyStats,
  getBookingPercentageByCategory,
} = require("./payment.controller");
const { create } = require("./payment.model");
const auth = require("../../middleware/auth");
const USER_ROLE = require("../user/user.constant");
const router = express.Router();

// Create Payment
router.post("/create-payment", createPayment);

// Capture Payment
router.post("/confirm-payment", confirmPayment);

router.get("/my-payments", auth(USER_ROLE.user), getMyPayments);
router.get("/", auth(USER_ROLE.admin), getAllPayments);
router.get("/stats", auth(USER_ROLE.admin), getMonthlyStats);
router.get(
  "/category-stats",
  auth(USER_ROLE.admin),
  getBookingPercentageByCategory
);

const paymentRouter = router;
module.exports = paymentRouter;
