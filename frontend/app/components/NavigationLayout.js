// src/components/NavigationLayout.js
"use client";

import React, { useState } from "react";
import { CssBaseline, Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function NavigationLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = (open) => () => {
    setSidebarOpen(open);
  };

  return (
    <>
      <CssBaseline />
      {/* Header now receives the toggle function */}
      <Header toggleSidebar={toggleSidebar} />
      {/* Sidebar receives its open state and toggle function */}
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          mt: 8,
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
        }}
      >
        {children}
      </Box>
    </>
  );
}
