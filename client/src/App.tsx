import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PersistentDrawer from "./components/PersistentDrawer";
import { Box } from "@mui/material";
import { useAuth } from "./contexts/AuthContextWrapper";
import Login from "./pages/Login";
import Technicians from "./pages/Technicians";
import Jobs from "./pages/Jobs";
import Phone from "./pages/Phone";
import Calls from "./pages/Calls";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";

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
              <Route path="/phone" element={<Phone />} />
              <Route path="/technicians" element={<Technicians />} />
              <Route path="/calls" element={<Calls />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Box>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      )}
    </Box>
  );
};

export default App;
