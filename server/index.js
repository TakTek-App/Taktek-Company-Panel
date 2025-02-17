import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(json());

// 🔹 Endpoint para guardar la tarjeta del usuario
app.post("/save-card", async (req, res) => {
  const { email, paymentMethodId } = req.body;

  try {
    let customer = await stripe.customers.list({ email });
    customer = customer.data.length ? customer.data[0] : null;

    if (!customer) {
      customer = await stripe.customers.create({ email });
    }

    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    res.json({ success: true, customerId: customer.id });
  } catch (error) {
    console.error("Error al guardar la tarjeta:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Endpoint para cobrar automáticamente los viernes
app.post("/charge", async (req, res) => {
  try {
    const { customerId, amount } = req.body;

    // 3️⃣ Crear un pago automático
    const paymentIntent = await stripe.paymentIntents.create({
      customer: customerId,
      amount: amount * 100, // Stripe usa centavos
      currency: "usd",
      payment_method_types: ["card"],
      confirm: true,
      off_session: true,
    });

    res.json({ success: true, paymentIntent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Endpoint alternativo para cobrar automáticamente
app.post("/charge-user", async (req, res) => {
  const { customerId, amount } = req.body;

  try {
    // 🚨 Verificamos si el cliente tiene un método de pago guardado
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    if (paymentMethods.data.length === 0) {
      return res
        .status(400)
        .json({ error: "El cliente no tiene tarjetas guardadas." });
    }

    // ✅ Tomamos el primer método de pago del cliente
    const paymentMethodId = paymentMethods.data[0].id;

    // ✅ Creamos el PaymentIntent y usamos la tarjeta guardada
    const paymentIntent = await stripe.paymentIntents.create({
      customer: customerId,
      amount: amount * 100, // 💲 Convertimos a centavos
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true, // 🚨 Confirmamos el pago de una vez
      automatic_payment_methods: {
        enabled: true, // ✅ Habilita métodos automáticos
        allow_redirects: "never", // ❌ Evita métodos con redirección
      },
    });

    res.json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Error en el pago:", error);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(3001, () => console.log("Server running on port 3001"));
