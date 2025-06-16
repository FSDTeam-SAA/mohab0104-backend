const PaymentInfo = require("./payment.model");
const User = require("../user/user.model");
const paymentInfo = require("./payment.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPayment = async (req, res) => {
  const { userId, serviceId, amount } = req.body;

  if (!userId || !serviceId || !amount) {
    return res.status(400).json({
      error: "userId, serviceId, and amount are required.",
    });
  }

  try {
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects the amount in cents
      currency: "usd",
      metadata: {
        userId,
        serviceId,
      },
    });

    // Save payment record with status 'pending'
    const paymentInfo = new PaymentInfo({
      userId,
      serviceId,
      amount,
      transactionId: paymentIntent.id,
      status: "pending",
    });
    await paymentInfo.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      message:
        "PaymentIntent created. Use clientSecret in frontend Payment Element.",
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).json({
      error: "Internal server error.",
    });
  }
};

// Confirm Payment – Stripe will automatically confirm via webhook or frontend, but optionally:
exports.confirmPayment = async (req, res) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({
      error: "paymentIntentId is required.",
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update payment record
      await PaymentInfo.findOneAndUpdate(
        { transactionId: paymentIntentId },
        { status: "success" }
      );

      return res.status(200).json({
        success: true,
        message: "Payment successfully captured.",
        paymentIntent,
      });
    } else {
      await PaymentInfo.findOneAndUpdate(
        { transactionId: paymentIntentId },
        { status: "failed" }
      );

      return res.status(400).json({
        error: "Payment was not successful.",
      });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({
      error: "Internal server error.",
    });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    // Pagination params with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [payments, totalItems] = await Promise.all([
      PaymentInfo.find({ userId: user._id })
        .populate("userId", "name email")
        .populate("serviceId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      PaymentInfo.countDocuments({ userId: user._id }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      success: true,
      message: "Your payments fetched successfully.",
      data: payments,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [totalItems, payments] = await Promise.all([
      PaymentInfo.countDocuments({ status: "success" }),
      PaymentInfo.find({})
        .populate("userId", "firstName lastName email")
        .populate("serviceId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      success: true,
      message: "All payments fetched successfully.",
      data: payments,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

exports.getMonthlyStats = async (req, res) => {
  try {
    // 1. Get revenue & booking count per month
    const revenueStats = await paymentInfo.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalRevenue: { $sum: "$amount" },
          totalBooking: { $sum: 1 },
        },
      },
    ]);

    // 2. Calculate total bookings in year (to get percentages)
    // const totalYearlyBooking = revenueStats.reduce(
    //   (acc, item) => acc + item.totalBooking,
    //   0
    // );

    // 3. Map to all months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const result = months.map((month, index) => {
      const entry = revenueStats.find((e) => e._id.month === index + 1);
      const revenue = entry ? entry.totalRevenue : 0;
      const bookingCount = entry ? entry.totalBooking : 0;

      // Booking % of total yearly bookings
      // const bookingPercentage = totalYearlyBooking
      //   ? Math.round((bookingCount / totalYearlyBooking) * 100)
      //   : 0;

      return {
        month,
        revenue,
        booking: bookingCount,
      };
    });

    res.status(200).json({
      success: true,
      message: "Monthly revenue and booking percentage fetched.",
      data: result,
    });
  } catch (error) {
    console.error("Error getting monthly stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get monthly stats.",
    });
  }
};

exports.getBookingPercentageByCategory = async (req, res) => {
  try {
    const payments = await paymentInfo
      .find({ status: "success" })
      .populate("serviceId");

    const bookingCounts = {};
    let total = 0;
    const userSet = new Set();

    for (const payment of payments) {
      const category = payment.serviceId?.serviceTitle;
      if (!category) continue;

      bookingCounts[category] = (bookingCounts[category] || 0) + 1;
      total++;

      // Collect unique users who made bookings
      userSet.add(payment.userId.toString());
    }

    // Get total user count from your User model
    const totalUsersInSystem = await User.countDocuments();

    const data = Object.entries(bookingCounts).map(([category, count]) => ({
      category,
      bookings: count,
    }));

    data.sort((a, b) => b.bookings - a.bookings);

    res.status(200).json({
      success: true,
      message: "category percentage get successfully.",
      usersWithBookings: userSet.size,
      data,
    });
  } catch (error) {
    console.error("Error getting booking stats by category:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch booking stats by category.",
    });
  }
};
