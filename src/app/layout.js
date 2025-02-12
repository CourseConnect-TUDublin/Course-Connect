// src/app/layout.js
import ClientAuthProviderWrapper from "../components/ClientAuthProviderWrapper";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { CssBaseline, Box, Toolbar } from "@mui/material";

export const metadata = {
  title: "Course Connect",
  description: "University Timetable Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add your global head elements here */}
      </head>
      <body>
        <CssBaseline />
        {/* Wrap the entire app in the AuthProvider (client component) */}
        <ClientAuthProviderWrapper>
          <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1 }}>
              <TopNav />
              <Toolbar /> {/* This leaves space for the fixed TopNav */}
              {children}
            </Box>
          </Box>
        </ClientAuthProviderWrapper>
      </body>
    </html>
  );
}
