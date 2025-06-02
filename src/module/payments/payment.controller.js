// const paypal = require("@paypal/checkout-server-sdk");
const createPaypalClient = require("../../lib/paypalClient");
const PaymentInfo = require("./payment.model");
const User = require("../user/user.model");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Create Payment
// exports.createPayment = async (req, res) => {
//   const { userId, serviceId, amount } = req.body;

//   if (!userId || !serviceId || !amount) {
//     return res.status(400).json({
//       error: "userId, serviceId, and amount are required.",
//     });
//   }

//   const client = createPaypalClient();
//   const request = new paypal.orders.OrdersCreateRequest();
//   request.prefer("return=representation");
//   request.requestBody({
//     intent: "CAPTURE",
//     purchase_units: [
//       {
//         amount: {
//           currency_code: "USD",
//           value: amount,
//         },
//       },
//     ],
//   });

//   try {
//     const order = await client.execute(request);
//     const orderId = order.result.id;

//     // Save payment record
//     const paymentInfo = new PaymentInfo({
//       userId,
//       serviceId,
//       amount,
//       transactionId: orderId,
//       status: "pending",
//     });
//     await paymentInfo.save();

//     res.status(200).json({
//       success: true,
//       orderId,
//       message: "Payment created. Capture the payment to complete.",
//     });
//   } catch (error) {
//     console.error("Error creating PayPal order:", error);
//     res.status(500).send("Internal server error.");
//   }
// };

exports.createPayment = async (req, res) => {
  const { userId, serviceId, amount } = req.body

  if (!userId || !serviceId || !amount) {
    return res.status(400).json({
      error: 'userId, serviceId, and amount are required.',
    })
  }

  try {
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects the amount in cents
      currency: 'usd',
      metadata: {
        userId,
        serviceId,
      },
    })

    // Save payment record with status 'pending'
    const paymentInfo = new PaymentInfo({
      userId,
      serviceId,
      amount,
      transactionId: paymentIntent.id,
      status: 'pending',
    })
    await paymentInfo.save()

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      message:
        'PaymentIntent created. Use clientSecret in frontend Payment Element.',
    })
  } catch (error) {
    console.error('Error creating PaymentIntent:', error)
    res.status(500).json({
      error: 'Internal server error.',
    })
  }
}

// Capture Payment
// exports.capturePayment = async (req, res) => {
//   const { orderId } = req.body;

//   if (!orderId) {
//     return res.status(400).json({
//       error: "orderId is required.",
//     });
//   }

//   try {
//     const client = createPaypalClient();
//     const request = new paypal.orders.OrdersCaptureRequest(orderId);
//     request.requestBody({});

//     const capture = await client.execute(request);

//     if (capture.result.status === "COMPLETED") {
//       // Update payment record
//       await PaymentInfo.findOneAndUpdate(
//         { transactionId: orderId },
//         { status: "success" }
//       );

//       res.status(200).json({
//         status: "COMPLETED",
//         orderId: capture.result.id,
//         message: "Payment successfully captured.",
//       });
//     } else {
//       await PaymentInfo.findOneAndUpdate(
//         { transactionId: orderId },
//         { status: "failed" }
//       );

//       res.status(400).json({
//         error: "Payment was not successfully captured.",
//       });
//     }
//   } catch (error) {
//     console.error("Error capturing payment:", error);
//     res.status(500).send("Internal server error.");
//   }
// };

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

    const payments = await PaymentInfo.find({ userId: user._id })
      .populate("userId", "name email")
      .populate("serviceId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Your payments fetched successfully.",
      payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentInfo.find({})
      .populate("userId", "name email")
      .populate("serviceId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All payments fetched successfully.",
      payments,
    });
  } catch (error) {
    console.error("Error fetching all payments:", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};
