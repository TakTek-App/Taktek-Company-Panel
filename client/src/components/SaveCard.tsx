import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../contexts/AuthContextWrapper";

const SaveCard = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const { company } = useAuth();
  const theme = useTheme();

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: theme.palette.mode === "light" ? "#000000" : "#ffffff",
        "::placeholder": { color: "#aaa" },
        fontFamily: "'Roboto', sans-serif",
        padding: "12px",
        backgroundColor: "transparent",
      },
      invalid: { color: "#ff1744" }, // 🔴 Rojo cuando hay error
    },
  };

  const handleSaveCard = async () => {
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error("Card Element no encontrado");
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement, // ✅ Ahora es seguro
    });

    const getCompany = async () => {
      const data = await axios.get(
        `https://admin-panel-pple.onrender.com/companies/${company?.id}`
      );

      console.log(data.data);
      console.log(JSON.stringify(data.data));

      localStorage.setItem("company", JSON.stringify(data.data));
    };

    if (error) return console.error(error.message);

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_ENDPOINT}save-card`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, paymentMethodId: paymentMethod.id }),
      }
    );

    const data = await response.json();

    if (data.customerId) {
      axios.patch(
        `https://admin-panel-pple.onrender.com/companies/${company?.id}`,
        {
          customerId: data?.customerId,
        }
      );
      localStorage.removeItem("company");
      getCompany();
      // localStorage.setItem("comp", data.customerId); // ✅ Guardar customerId
      console.log("Tarjeta guardada y customerId almacenado:", data.customerId);
    } else {
      console.error("No se pudo obtener el customerId del backend.");
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Type the following details
      </Typography>

      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box
        sx={{
          padding: 2,
          border: "1px solid #ccc",
          borderRadius: 2,
          backgroundColor:
            theme.palette.mode === "light" ? "#ffffff" : "#ffffff15",
        }}
      >
        <CardElement options={cardElementOptions} />
      </Box>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleSaveCard}
      >
        Save Card
      </Button>
    </Paper>
  );
};

export default SaveCard;
