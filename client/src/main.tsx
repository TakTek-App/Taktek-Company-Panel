// import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import App from "./App";
import { darkTheme, lightTheme } from "./customTheme";
import { useState } from "react";
import AuthContextWrapper from "./contexts/AuthContextWrapper";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "./utils/stripe";

const Root = () => {
  const [themeMode, setThemeMode] = useState(() => {
    // Recupera el tema inicial desde localStorage, o establece "light" por defecto
    return localStorage.getItem("themeMode") || "light";
  });

  const toggleTheme = () => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === "dark" ? "light" : "dark";
      localStorage.setItem("themeMode", newMode); // Guarda el nuevo valor en localStorage
      return newMode;
    });
  };

  // Seleccionar el tema según el estado
  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthContextWrapper>
          <Elements stripe={stripePromise}>
            <App toggleTheme={toggleTheme} />
          </Elements>
        </AuthContextWrapper>
      </ThemeProvider>
    </BrowserRouter>
  );
};

// Aquí, pasamos el componente Root a createRoot
createRoot(document.getElementById("root")!).render(<Root />);
