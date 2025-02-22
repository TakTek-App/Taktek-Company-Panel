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
  ChevronLeft,
  ChevronRight,
  DarkMode,
  Dialpad,
  Home,
  LightMode,
  Logout,
  People,
  Phone,
  Support,
  Work,
} from "@mui/icons-material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useNavigate } from "react-router-dom";
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

const PersistentDrawerMobile = ({
  toggleTheme,
}: {
  toggleTheme: () => void;
}) => {
  const navigate = useNavigate();
  const { setSignedIn } = useAuth();
  // const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logout = () => {
    setSignedIn(false);
    navigate("/");
  };

  const theme = useTheme();

  const itemList = [
    { text: "Home", icon: <Home />, onClick: () => navigate("/home") },
    {
      text: "Jobs",
      icon: <Work />,
      onClick: () => {
        navigate("/jobs");
        setOpen(false);
      },
    },
    {
      text: "Calls",
      icon: <Phone />,
      onClick: () => {
        navigate("/calls");
        setOpen(false);
      },
    },
    {
      text: "Phone",
      icon: <Dialpad />,
      onClick: () => {
        navigate("/phone");
        setOpen(false);
      },
    },
    {
      text: "Technicians",
      icon: <People />,
      onClick: () => {
        navigate("/technicians");
        setOpen(false);
      },
    },
    {
      text: "Profile",
      icon: <Business />,
      onClick: () => {
        navigate("/profile");
        setOpen(false);
      },
    },
    {
      text: "Logout",
      icon: <Logout />,
      onClick: () => logout(),
    },
    {
      text: "Support",
      icon: <Support />,
      onClick: () => {
        navigate("/support");
        setOpen(false);
      },
    },
    {
      text: theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode",
      icon: theme.palette.mode === "dark" ? <LightMode /> : <DarkMode />,
      onClick: () => {
        toggleTheme();
        setOpen(false);
      },
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
                color: "#fff",
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
        variant="persistent"
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
          <Box sx={{ width: "250px", margin: "auto" }}>
            {theme.palette.mode === "dark" ? (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/sds-main-29a46.firebasestorage.app/o/images%2Ftaktek_logo-rectangle.png?alt=media&token=9d15ea8c-084a-4999-b51a-b8711cdab59c"
                width="100%"
              />
            ) : (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/sds-main-29a46.firebasestorage.app/o/images%2Ftaktek_logo_rectangle_black.png?alt=media&token=e2faaa6e-f44c-4e07-831b-c970c9e6c8da"
                width="100%"
              />
            )}
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
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

export default PersistentDrawerMobile;
