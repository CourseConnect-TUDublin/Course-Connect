// src/components/MainLayout.js
"use client";

import React, { useState } from "react";
import { CssBaseline, Box, Drawer, Toolbar } from "@mui/material";
import Header from "./Header";
import ConditionalSidebar from "./ConditionalSidebar";

// Default AppBar height (MUI): 64px desktop, 56px mobile
const APPBAR_HEIGHT = { xs: "56px", sm: "64px" };

export default function MainLayout({ children, drawerWidth }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#fafbfc" }}>
      <CssBaseline />

      {/* Sidebar Drawer (Desktop) */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#fff",
            color: "#000",
            borderRight: "1px solid #eaeaea",
          },
        }}
      >
        {/* Push sidebar content below AppBar */}
        <Toolbar sx={{ minHeight: APPBAR_HEIGHT }} />
        <ConditionalSidebar />
      </Drawer>

      {/* Sidebar Drawer (Mobile) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#fff",
            color: "#000",
            borderRight: "1px solid #eaeaea",
          },
        }}
      >
        <ConditionalSidebar />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: `${drawerWidth}px` },   // leave space for sidebar on desktop
          pt: APPBAR_HEIGHT,                       // push content below the AppBar
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
        }}
      >
        {/* Fixed AppBar/Header */}
        <Header drawerWidth={drawerWidth} toggleSidebar={handleDrawerToggle} />
        {/* Only one <Toolbar /> for vertical offset, already applied with pt */}
        {children}
      </Box>
    </Box>
  );
}
