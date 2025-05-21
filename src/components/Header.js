"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { usePathname, useRouter } from "next/navigation";
import NotificationsBell from "./NotificationsBell";
import { useSession, signOut } from "next-auth/react";

export default function Header({ toggleSidebar, drawerWidth }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const userName = session?.user?.name ?? session?.user?.email ?? "Guest";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen((open) => !open);

  const navItems = [
    { label: "Home", route: "/home" },
    { label: "Dashboard", route: "/dashboard" },
    // Add more if needed
  ];

  // Drawer content for mobile menu
  const drawerContent = (
    <Box sx={{ width: 240, p: 2 }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.route} disablePadding>
            <ListItemButton
              component={Link}
              href={item.route}
              selected={pathname === item.route}
              onClick={handleDrawerToggle}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Profile link */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/profile"
            selected={pathname === "/profile"}
            onClick={handleDrawerToggle}
          >
            <Avatar sx={{ width: 28, height: 28, mr: 1 }}>
              {userName.charAt(0).toUpperCase()}
            </Avatar>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => signOut({ callbackUrl: "/login" })}>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        sx={{
          width: drawerWidth ? `calc(100% - ${drawerWidth}px)` : "100%",
          ml: drawerWidth ? `${drawerWidth}px` : 0,
          backgroundColor: "#fff",
          color: "#000",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Box display="flex" alignItems="center">
            {drawerWidth && isMobile && (
              <IconButton
                onClick={() => toggleSidebar?.(true)}
                color="inherit"
                edge="start"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            {!drawerWidth && (
              <IconButton
                onClick={handleDrawerToggle}
                color="inherit"
                edge="start"
                sx={{ mr: 2, display: { md: "none" } }}
                aria-label="Open menu"
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Course Connect
            </Typography>
          </Box>

          {/* Desktop navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
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

            <NotificationsBell />

            {/* Profile link */}
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

      {/* Drawer for mobile navigation */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {drawerContent}
      </Drawer>

      <Toolbar /> {/* Spacer */}
    </>
  );
}
