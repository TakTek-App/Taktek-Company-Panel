import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PersistentDrawer from "./components/PersistentDrawer";
import { Box } from "@mui/material";
import Calls from "./pages/Calls";
import { useAuth } from "./contexts/AuthContextWrapper";
import Login from "./pages/Login";
import Technicians from "./pages/Technicians";

const App = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const drawerWidth = 240;
  const { signedIn } = useAuth();
  return (
    <Box>
      {signedIn ? (
        <>
          <PersistentDrawer toggleTheme={toggleTheme} />
          <Box
            sx={{
              width: `calc(100% - ${drawerWidth}px)`,
              margin: "auto",
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/calls" element={<Calls />} />
              <Route path="/technicians" element={<Technicians />} />
            </Routes>
          </Box>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </Box>
  );
};

export default App;
