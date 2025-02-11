// src/app/layout.js

import { CssBaseline, Box, Toolbar } from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export const metadata = {
  title: "Course Connect",
  description: "University Timetable Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* You can add your common <head> elements here */}
      </head>
      <body>
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <TopNav />
            <Toolbar /> {/* This ensures there's space for the fixed top nav */}
            {children} {/* This renders the page-specific content */}
          </Box>
        </Box>
      </body>
    </html>
  );
}
