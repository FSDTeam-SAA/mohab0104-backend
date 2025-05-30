const paypal = require('@paypal/checkout-server-sdk')
const createPaypalClient = require('../../lib/paypalClient')
const PaymentInfo = require('./payment.model')

// Create Payment
exports.createPayment = async (req, res) => {
  const { userId, serviceId, amount } = req.body

  if (!userId || !serviceId || !amount) {
    return res.status(400).json({
      error: 'userId, serviceId, and amount are required.',
    })
  }

  const client = createPaypalClient()
  const request = new paypal.orders.OrdersCreateRequest()
  request.prefer('return=representation')
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: amount,
        },
      },
    ],
  })

  try {
    const order = await client.execute(request)
    const orderId = order.result.id

    // Save payment record
    const paymentInfo = new PaymentInfo({
      userId,
      serviceId,
      amount,
      transactionId: orderId,
      status: 'pending',
    })
    await paymentInfo.save()

    res.json({
      orderId,
      message: 'Payment created. Capture the payment to complete.',
    })
  } catch (error) {
    console.error('Error creating PayPal order:', error)
    res.status(500).send('Internal server error.')
  }
}

// Capture Payment
exports.capturePayment = async (req, res) => {
  const { orderId } = req.body

  if (!orderId) {
    return res.status(400).json({
      error: 'orderId is required.',
    })
  }

  try {
    const client = createPaypalClient()
    const request = new paypal.orders.OrdersCaptureRequest(orderId)
    request.requestBody({})

    const capture = await client.execute(request)

    if (capture.result.status === 'COMPLETED') {
      // Update payment record
      await PaymentInfo.findOneAndUpdate(
        { transactionId: orderId },
        { status: 'success' }
      )

      res.json({
        status: 'COMPLETED',
        orderId: capture.result.id,
        message: 'Payment successfully captured.',
      })
    } else {
      await PaymentInfo.findOneAndUpdate(
        { transactionId: orderId },
        { status: 'failed' }
      )

      res.status(400).json({
        error: 'Payment was not successfully captured.',
      })
    }
  } catch (error) {
    console.error('Error capturing payment:', error)
    res.status(500).send('Internal server error.')
  }
}
