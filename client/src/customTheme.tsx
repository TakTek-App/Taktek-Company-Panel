import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#1d71bf",
    },
    secondary: {
      main: "#1d960d",
    },
    mode: "light",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#1d960d",
          textTransform: "capitalize",
          fontSize: "18px",
          color: "#ffffff",
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          color: "#1d71bf",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#1d71bf",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "#1d71bf",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#1d71bf",
    },
    secondary: {
      main: "#1d960d",
    },
    mode: "dark",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#1d71bf",
          textTransform: "capitalize",
          fontSize: "18px",
          color: "#ffffff",
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          color: "#1d960d",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#1d960d",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "#1d960d",
        },
      },
    },
  },
});
