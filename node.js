// Simplified endpoint to confirm payment
app.get('/api/check-payment', async (req, res) => {
  const userEmail = req.query.email;
  const user = await db.getUserByEmail(userEmail); // Your DB logic here

  if (user && user.paymentConfirmed) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
