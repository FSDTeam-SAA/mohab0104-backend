const paypal = require('@paypal/checkout-server-sdk')

function createPaypalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret)
  const client = new paypal.core.PayPalHttpClient(environment)
  return client
}

module.exports = createPaypalClient
