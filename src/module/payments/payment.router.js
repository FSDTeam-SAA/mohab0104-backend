const express = require('express')
const { createPayment, capturePayment } = require('./payment.controller')
const { create } = require('./payment.model')
const router = express.Router()

// Create Payment
router.post('/create-payment', createPayment)

// Capture Payment
router.post('/capture-payment', capturePayment)

const paymentRouter = router
module.exports = paymentRouter
