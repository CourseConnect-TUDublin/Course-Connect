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
  Card,
  useTheme,
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
import { Hourglass } from "lucide-react";

const toolItems = [
  { label: "Dashboard", route: "/dashboard", icon: <DashboardIcon fontSize="large" /> },
  { label: "Task Manager", route: "/TaskManager", icon: <Assignment fontSize="large" /> },
  { label: "Timetable", route: "/timetable", icon: <CalendarToday fontSize="large" /> },
  { label: "Flashcards", route: "/flashcards", icon: <Card fontSize="large" /> },
  { label: "Focus Timer", route: "/FocusTimer", icon: <Hourglass size={32} strokeWidth={2.2} /> },
  { label: "Study Buddy", route: "/StudyBuddy", icon: <People fontSize="large" /> },
  { label: "Chat Room", route: "/chatroom", icon: <Chat fontSize="large" /> },
  { label: "Calendar", route: "/calendar", icon: <CalendarToday fontSize="large" /> },
  { label: "Help Center", route: "/helpcenter", icon: <Help fontSize="large" /> },
  { label: "Settings", route: "/settings", icon: <Settings fontSize="large" /> },
];

export default function HomePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email || "Guest";
  const theme = useTheme();

  // Choose a subtle section background and pastel accent for highlights
  const pastelAccent = "#ffe082";
  const sectionBg = "#f9f9fa";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Box sx={{ backgroundColor: sectionBg, minHeight: "100vh" }}>
        <CssBaseline />
        {/* Top Navigation */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: "100%",
            backgroundColor: "#fff",
            color: "#222",
            borderBottom: "1px solid #eaeaea",
            zIndex: 1201,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "0.5px" }}>
              Course Connect
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton color="inherit"><Search /></IconButton>
              <IconButton color="inherit"><Notifications /></IconButton>
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

        {/* Hero/Welcome */}
        <Box
          sx={{
            maxWidth: 900,
            mx: "auto",
            px: { xs: 2, sm: 4 },
            pt: 6,
            pb: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              color: "#222",
              letterSpacing: "-1px",
              mb: 1,
              fontSize: { xs: 28, sm: 34, md: 38 },
            }}
          >
            Welcome, {userName}!
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              mb: 2,
              fontSize: { xs: 17, sm: 20 },
            }}
          >
            All your study tools in one place. Jump into your Dashboard or explore the features below!
          </Typography>
        </Box>

        {/* Widget Grid */}
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, sm: 3 },
            pb: 8,
          }}
        >
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {toolItems.map((tool, idx) => (
              <Grid item xs={12} sm={6} md={4} key={tool.label}>
                <Link href={tool.route} passHref legacyBehavior style={{ textDecoration: "none" }}>
                  <Paper
                    component="a"
                    elevation={idx % 2 === 0 ? 6 : 2}
                    sx={{
                      p: { xs: 3, sm: 4 },
                      borderRadius: 3,
                      background: idx % 3 === 0 ? pastelAccent : "#fff",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-6px) scale(1.025)",
                        boxShadow: "0 8px 32px #ffd60055",
                        background: pastelAccent,
                      },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      cursor: "pointer",
                      minHeight: 180,
                      outline: "none",
                    }}
                  >
                    <Box sx={{ mb: 2, color: "#1976d2" }}>
                      {tool.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: "#222",
                        fontSize: 20,
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {tool.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getToolDescription(tool.label)}
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

// Helper for better descriptions
function getToolDescription(label) {
  switch (label) {
    case "Dashboard":
      return "Your academic overview & stats";
    case "Task Manager":
      return "Organise, prioritise, and track your tasks";
    case "Timetable":
      return "View your upcoming classes and events";
    case "Flashcards":
      return "Revise with interactive flashcards";
    case "Focus Timer":
      return "Pomodoro-inspired productivity sessions";
    case "Study Buddy":
      return "Connect with classmates and friends";
    case "Chat Room":
      return "Group chat and private DMs";
    case "Calendar":
      return "All your deadlines and sessions in one view";
    case "Help Center":
      return "Get help, FAQs, and support";
    case "Settings":
      return "Customise your experience";
    default:
      return `Quick preview of ${label}`;
  }
}
