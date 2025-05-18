// src/app/home/layout.js
import "../globals.css";
import ClientProviders from "../../ClientProviders";
import Header from "../../components/Header";
import { CssBaseline, Box } from "@mui/material";

// Only use <html> and <body> in the root layout.js (src/app/layout.js)
// For nested layouts, return fragment or a single element.

export const metadata = {
  title: "Course Connect - Home",
  description: "Welcome page for Course Connect",
};

export default function HomeLayout({ children }) {
  return (
    <ClientProviders>
      <CssBaseline />
      {/* Consistent Header */}
      <Header />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          mt: 8,
          px: { xs: 2, sm: 3 },
          pb: 4,
          minHeight: "90vh",
          background: "#f9f9fa",
        }}
      >
        {children}
      </Box>
    </ClientProviders>
  );
}
