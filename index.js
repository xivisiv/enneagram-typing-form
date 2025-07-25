const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// In-memory store (replace with DB in production)
const verifiedPayments = new Set();

app.use(bodyParser.json());

// Endpoint for PayPal Webhook
app.post('/webhook/paypal', (req, res) => {
  const event = req.body;

  if (event.event_type === 'CHECKOUT.ORDER.APPROVED' || event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    const email = event.resource.payer.email_address;
    console.log('✅ Payment received from:', email);
    verifiedPayments.add(email.toLowerCase());
  }

  res.status(200).send('OK');
});

// API to check if payment is confirmed
app.get('/api/check-payment', (req, res) => {
  const email = (req.query.email || '').toLowerCase();
  if (verifiedPayments.has(email)) {
    return res.json({ success: true });
  }
  return res.json({ success: false });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
