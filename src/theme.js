// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#0071e3", // Modern accent color
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#ffffff",
      paper: "#fafafa",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    h6: {
      fontWeight: 700,
    },
    // Further customization as needed
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 4,
        },
      },
    },
    // Override more component styles if needed
  },
});

export default theme;
