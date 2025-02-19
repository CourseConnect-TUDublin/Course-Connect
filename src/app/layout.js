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
      <head>{/* global head elements */}</head>
      <body>
        <CssBaseline />
        <ClientAuthProviderWrapper>
          <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1 }}>
              <TopNav />
              <Toolbar /> {/* Reserve space for fixed TopNav */}
              {children}
            </Box>
          </Box>
        </ClientAuthProviderWrapper>
      </body>
    </html>
  );
}
