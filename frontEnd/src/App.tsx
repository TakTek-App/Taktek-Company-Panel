import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PersistentDrawer from "./components/PersistentDrawer";
import { Box } from "@mui/material";
import Calls from "./pages/Calls";

const App = () => {
  const drawerWidth = 240;
  return (
    <Box>
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
        <PersistentDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calls" element={<Calls />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
