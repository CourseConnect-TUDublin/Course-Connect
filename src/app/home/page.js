"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CssBaseline,
  IconButton,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Notifications,
  Dashboard as DashboardIcon,
  Assignment,
  CalendarToday,
  CheckBox,
  People,
  Chat,
  Help,
  Settings,
} from "@mui/icons-material";
import { useSession, signOut } from "next-auth/react";

// Define tool items (widgets) for the home overview
const toolItems = [
  { label: "Dashboard", route: "/dashboard", icon: <DashboardIcon fontSize="large" /> },
  { label: "Task Manager", route: "/TaskManager", icon: <Assignment fontSize="large" /> },
  { label: "Timetable", route: "/timetable", icon: <CalendarToday fontSize="large" /> },
  { label: "Assignments", route: "/assignments", icon: <Assignment fontSize="large" /> },
  { label: "To-Do", route: "/todo", icon: <CheckBox fontSize="large" /> },
  { label: "Study-Buddy", route: "/study-buddy", icon: <People fontSize="large" /> },
  { label: "Chat Room", route: "/chatroom", icon: <Chat fontSize="large" /> },
  { label: "Calendar", route: "/calendar", icon: <CalendarToday fontSize="large" /> },
  { label: "Help Center", route: "/helpcenter", icon: <Help fontSize="large" /> },
  { label: "Settings", route: "/settings", icon: <Settings fontSize="large" /> },
];

export default function HomePage() {
  const { data: session } = useSession();
  const userName = session?.user?.email || "Guest";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Box sx={{ backgroundColor: "#ffffff" }}>
        <CssBaseline />
        {/* Top Navigation */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: "100%",
            backgroundColor: "#ffffff",
            color: "#000000",
            borderBottom: "1px solid #eaeaea",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Course Connect
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton color="inherit">
                <Search />
              </IconButton>
              <IconButton color="inherit">
                <Notifications />
              </IconButton>
              <Typography variant="body1" sx={{ ml: 2, fontWeight: 500 }}>
                {userName}
              </Typography>
              <Button
                color="secondary"
                onClick={() => signOut({ callbackUrl: "/login" })}
                sx={{ ml: 2, textTransform: "none" }}
              >
                Sign Out
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />

        {/* Main Content Container */}
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, sm: 3 },
            py: { xs: 3, sm: 4 },
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, letterSpacing: "-0.5px", mb: 1 }}>
            Welcome, {userName}!
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: { xs: 2, sm: 3 }, color: "#666666" }}>
            Explore your tools:
          </Typography>

          {/* Widget Grid */}
          <Grid container spacing={4}>
            {toolItems.map((tool) => (
              <Grid item xs={12} sm={6} md={4} key={tool.label}>
                <Link href={tool.route} passHref legacyBehavior style={{ textDecoration: "none" }}>
                  <Paper
                    component="a"
                    elevation={3}
                    sx={{
                      p: { xs: 3, sm: 4 },
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      cursor: "pointer",
                      height: "100%",
                    }}
                  >
                    <Box sx={{ mb: 2 }}>{tool.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {tool.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quick preview of {tool.label}
                    </Typography>
                  </Paper>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </motion.div>
  );
}
