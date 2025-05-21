import "../globals.css";
import ClientProviders from "../../ClientProviders";
import Header from "../../components/Header";
import { CssBaseline, Box } from "@mui/material";
import { Toaster } from "react-hot-toast"; //  XP Toast support

export const metadata = {
  title: "Course Connect - Home",
  description: "Welcome page for Course Connect",
};

export default function HomeLayout({ children }) {
  return (
    <ClientProviders>
      <CssBaseline />
      {/* XP Toast Popups */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontWeight: 600,
            fontSize: "1rem",
            borderRadius: "10px",
            background: "#f8fff4",
            color: "#222",
            boxShadow: "0 2px 32px #97ffa055",
          },
        }}
      />
      {/* Consistent Header */}
      <Header />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          mt: { xs: 7.5, sm: 8 },
          px: { xs: 1.5, sm: 3 },
          pb: 4,
          minHeight: "90vh",
          background: "#f9f9fa",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </ClientProviders>
  );
}
