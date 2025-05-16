// frontend/app/components/MainLayout.js
"use client";

import React, { useState } from "react";
import { CssBaseline, Box, Drawer, Toolbar } from "@mui/material";
import Header from "./Header";
import ConditionalSidebar from "./ConditionalSidebar";

export default function MainLayout({ children, drawerWidth }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Mobile drawer */}
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
            backgroundColor: "#ffffff",
            color: "#000000",
            borderRight: "1px solid #eaeaea",
          },
        }}
      >
        <ConditionalSidebar />
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            color: "#000000",
            borderRight: "1px solid #eaeaea",
          },
        }}
      >
        <Toolbar />
        <ConditionalSidebar />
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          ml: { xs: 0, md: `${drawerWidth}px` },
        }}
      >
        <Header drawerWidth={drawerWidth} toggleSidebar={handleDrawerToggle} />
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
