const express = require("express");

const Stripe = require("stripe");
const cors = require("cors");

const stripe = new Stripe(
  "sk_test_51Qn2WiQ61pydXpHx14a17yi0LJcWDUd4Kr1f7ZtDj4XYZv6TIq4r07KMT02DaPNH3vQJEtioQ7pXagcexbPzaJeC00e4D7AypL"
);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/checkout", async (req, res) => {
  console.log(req.body);
  const { id, amount } = req.body;
  const payment = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    description: "Company yearly paymnent",
    payment_method: id,
    confirm: true,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });
  console.log(payment);
  //   res.send("Payment Success");
  res.json(payment);
});

app.listen(3000, () => {
  console.log("server on port", 3000);
});
