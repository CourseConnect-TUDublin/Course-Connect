// frontend/app/components/Header.js
"use client";

import React from "react";
import Link from "next/link";
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { usePathname, useRouter } from "next/navigation";
import NotificationsBell from "./NotificationsBell";
import Avatar from "@mui/material/Avatar";
import { useSession, signOut } from "next-auth/react";

export default function Header({ toggleSidebar, drawerWidth }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const userName = session?.user?.name ?? session?.user?.email ?? "Guest";

  const navItems = [
    { label: "Home", route: "/home" },
    { label: "Dashboard", route: "/dashboard" },
    // ...add other top-level links here
  ];

  return (
    <AppBar
      position="fixed"
      color="default"
      sx={{
        width: `calc(100% - ${drawerWidth || 0}px)`,
        ml: drawerWidth ? `${drawerWidth}px` : 0,
        backgroundColor: "#fff",
        color: "#000",
        borderBottom: "1px solid #eaeaea",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          {drawerWidth && (
            <IconButton
              onClick={() => toggleSidebar && toggleSidebar(true)}
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.route}
              component={Link}
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

          {/* Notifications bell */}
          <NotificationsBell />

          {/* User avatar + name + sign out */}
          <IconButton onClick={() => router.push("/profile")}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Typography variant="body2" sx={{ mx: 1 }}>
            {userName}
          </Typography>
          <Button color="inherit" onClick={() => signOut({ callbackUrl: "/login" })}>
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

