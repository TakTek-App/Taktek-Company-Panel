import {
  Box,
  IconButton,
  Toolbar,
  CssBaseline,
  Typography,
  styled,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import {
  Business,
  Call,
  DarkMode,
  Dialpad,
  Home,
  LightMode,
  ListAlt,
  LocalPhone,
  Logout,
  People,
  Phone,
  Work,
} from "@mui/icons-material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "../contexts/AuthContextWrapper";

const drawerWidth = 240;

// const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
//   open?: boolean;
// }>(({ theme }) => ({
//   flexGrow: 1,
//   padding: theme.spacing(3),
//   transition: theme.transitions.create("margin", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   marginLeft: `-${drawerWidth}px`,
//   variants: [
//     {
//       props: ({ open }) => open,
//       style: {
//         transition: theme.transitions.create("margin", {
//           easing: theme.transitions.easing.easeOut,
//           duration: theme.transitions.duration.enteringScreen,
//         }),
//         marginLeft: 0,
//       },
//     },
//   ],
// }));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const PersistentDrawer = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const navigate = useNavigate();
  const { setSignedIn } = useAuth();
  // const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  const logout = () => {
    setSignedIn(false);
    navigate("/");
  };

  const theme = useTheme();

  const itemList = [
    { text: "Home", icon: <Home />, onClick: () => navigate("/home") },
    { text: "Jobs", icon: <Work />, onClick: () => navigate("/jobs") },
    { text: "Calls", icon: <Phone />, onClick: () => navigate("/calls") },
    {
      text: "Phone",
      icon: <Dialpad />,
      onClick: () => navigate("/phone"),
    },
    {
      text: "Technicians",
      icon: <People />,
      onClick: () => navigate("/technicians"),
    },
    {
      text: "Profile",
      icon: <Business />,
      onClick: () => navigate("/profile"),
    },
    {
      text: "Logout",
      icon: <Logout />,
      onClick: () => logout(),
    },
    {
      text: theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode",
      icon: theme.palette.mode === "dark" ? <LightMode /> : <DarkMode />,
      onClick: () => toggleTheme(),
    },
  ];
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Company Panel</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        anchor="left"
        open={open}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <DrawerHeader>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
          </IconButton> */}
        </DrawerHeader>
        <Divider />
        <List>
          {itemList.map((item) => {
            const { text, icon, onClick } = item;
            return (
              <ListItemButton key={text} onClick={onClick}>
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={text} />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
      {/* <Main open={open}>
        {children}
      </Main> */}
    </Box>
  );
};

export default PersistentDrawer;
