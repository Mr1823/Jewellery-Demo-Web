import Stripe from "stripe";

const paymentRoutes = (app) => {
  // POST /create-payment-intent — Create Stripe payment intent
  app.post("/create-payment-intent", async (req, res) => {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey || stripeSecretKey === "your_stripe_secret_key_here") {
      // Return a mock response if Stripe is not configured
      return res.send({
        clientSecret: null,
        message: "Stripe is not configured. Set STRIPE_SECRET_KEY in .env",
      });
    }

    const stripe = new Stripe(stripeSecretKey);
    const { orderPrice } = req.body;

    const amount = Math.round(parseFloat(orderPrice) * 100); // Stripe expects amount in cents/paise

    if (amount < 1) {
      return res.status(400).send({ error: true, message: "Invalid amount" });
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "inr",
        payment_method_types: ["card"],
      });

      res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).send({ error: true, message: error.message });
    }
  });
};

export default paymentRoutes;
