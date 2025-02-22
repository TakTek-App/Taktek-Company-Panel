import { Navigate, Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
import PersistentDrawer from "./components/PersistentDrawer";
import { Box, useMediaQuery } from "@mui/material";
import { useAuth } from "./contexts/AuthContextWrapper";
import Login from "./pages/Login";
import Technicians from "./pages/Technicians";
import Jobs from "./pages/Jobs";
import Phone from "./pages/Phone";
import Calls from "./pages/Calls";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Verification from "./pages/Verification";
import PersistentDrawerMobile from "./components/PersistentDrawerMobile";
import Support from "./pages/Support";

const App = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const drawerWidth = 240;
  const { signedIn, company } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <Box>
      {signedIn && !company?.verified ? (
        <>
          {isMobile ? (
            <>
              <PersistentDrawerMobile toggleTheme={toggleTheme} />
              <Box
                sx={{
                  width: "100%",
                  margin: "auto",
                  minHeight: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Routes>
                  {/* <Route path="/home" element={<Home />} /> */}
                  <Route path="/phone" element={<Phone />} />
                  <Route path="/technicians" element={<Technicians />} />
                  <Route path="/calls" element={<Calls />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/support" element={<Support />} />
                </Routes>
              </Box>
            </>
          ) : (
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
                  {/* <Route path="/home" element={<Home />} /> */}
                  <Route path="/phone" element={<Phone />} />
                  <Route path="/technicians" element={<Technicians />} />
                  <Route path="/calls" element={<Calls />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/support" element={<Support />} />
                </Routes>
              </Box>
            </>
          )}
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      )}
      {!company?.verified && (
        <Routes>
          <Route
            path="/verification"
            element={
              <Verification paramToConfirm={company?.driverLicenseExpDate} />
            }
          />
        </Routes>
      )}
    </Box>
  );
};

export default App;
