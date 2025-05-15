// src/components/Header.js
"use client";

import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import NotificationsBell from "./NotificationsBell";

export default function Header({ toggleSidebar, drawerWidth }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Define your navigation links if needed
  const navItems = [
    { label: "Home", route: "/home" },
    { label: "Dashboard", route: "/dashboard" },
    // Add more as needed
  ];

  return (
    <AppBar
      position="fixed"
      color="default"
      sx={{
        width: `calc(100% - ${drawerWidth ? drawerWidth : 0}px)`,
        ml: drawerWidth ? `${drawerWidth}px` : 0,
        backgroundColor: "#ffffff",
        color: "#000000",
        borderBottom: "1px solid #eaeaea",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          {drawerWidth && (
            <IconButton
              onClick={() => toggleSidebar(true)}
              color="inherit"
              edge="start"
              sx={{ mr: 2, display: { xs: "block", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Course Connect
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Navigation Links */}
          {navItems.map((item) => (
            <Button
              key={item.label}
              href={item.route}
              sx={{
                color: pathname === item.route ? "primary.main" : "inherit",
                textTransform: "none",
                mx: 1,
              }}
            >
              {item.label}
            </Button>
          ))}

          {/* Notifications Bell */}
          {session?.user?.id && (
            <NotificationsBell userId={session.user.id} />
          )}

          {/* Optionally: user profile/avatar button */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
