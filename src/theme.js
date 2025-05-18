// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",      // Vivid modern blue
      contrastText: "#fff",
    },
    secondary: {
      main: "#ffb300",      // Modern amber/gold accent
      contrastText: "#fff",
    },
    background: {
      default: "#f5f7fa",   // Subtle light background
      paper: "#ffffff",     // Card backgrounds
    },
    text: {
      primary: "#212121",   // Near-black for readability
      secondary: "#6b7280", // Soft muted
    },
    success: {
      main: "#43a047",
    },
    warning: {
      main: "#fb8c00",
    },
    error: {
      main: "#e53935",
    },
    info: {
      main: "#0288d1",
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeightRegular: 400,
    fontWeightBold: 700,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: {
    borderRadius: 12, // Softer radii for cards, buttons
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 600,
          paddingLeft: 18,
          paddingRight: 18,
        },
        containedPrimary: {
          boxShadow: "0 2px 6px #1976d220",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 18px 0 rgba(25, 118, 210, 0.06)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px 0 #1976d212",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px #1976d211",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
