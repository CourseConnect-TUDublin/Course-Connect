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
  useTheme,
  Tooltip,
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

// Tool tile config
const toolItems = [
  { label: "Dashboard", route: "/dashboard", icon: <DashboardIcon sx={{ fontSize: 36 }} /> },
  { label: "Task Manager", route: "/TaskManager", icon: <Assignment sx={{ fontSize: 36 }} /> },
  { label: "Timetable", route: "/timetable", icon: <CalendarToday sx={{ fontSize: 36 }} /> },
  { label: "Flashcards", route: "/flashcards", icon: <CheckBox sx={{ fontSize: 36 }} /> },
  { label: "Focus Timer", route: "/FocusTimer", icon: <Hourglass size={34} strokeWidth={2.2} /> },
  { label: "Study Buddy", route: "/StudyBuddy", icon: <People sx={{ fontSize: 36 }} /> },
  { label: "Chat Room", route: "/chatroom", icon: <Chat sx={{ fontSize: 36 }} /> },
  { label: "Calendar", route: "/calendar", icon: <CalendarToday sx={{ fontSize: 36 }} /> },
  { label: "Help Center", route: "/helpcenter", icon: <Help sx={{ fontSize: 36 }} /> },
  { label: "Settings", route: "/settings", icon: <Settings sx={{ fontSize: 36 }} /> },
];

// Tool descriptions for preview text
function getToolDescription(label) {
  switch (label) {
    case "Dashboard":      return "Your academic overview & stats";
    case "Task Manager":   return "Organise, prioritise, and track your tasks";
    case "Timetable":      return "View your upcoming classes and events";
    case "Flashcards":     return "Revise with interactive flashcards";
    case "Focus Timer":    return "Pomodoro-inspired productivity sessions";
    case "Study Buddy":    return "Connect with classmates and friends";
    case "Chat Room":      return "Group chat and private DMs";
    case "Calendar":       return "All your deadlines and sessions in one view";
    case "Help Center":    return "Get help, FAQs, and support";
    case "Settings":       return "Customise your experience";
    default:               return `Quick preview of ${label}`;
  }
}

export default function HomePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email || "Guest";
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <CssBaseline />
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: "100%",
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: "1.5px solid #eee",
          zIndex: 1201,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "0.5px" }}>
            Course Connect
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Search">
              <IconButton color="inherit"><Search /></IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton color="inherit"><Notifications /></IconButton>
            </Tooltip>
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

      {/* Hero Section */}
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          px: { xs: 2, sm: 4 },
          pt: 8,
          pb: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            color: theme.palette.text.primary,
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
          All your study tools in one place.<br />
          Jump into your Dashboard or explore the features below!
        </Typography>
      </Box>

      {/* Tools Grid */}
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
              <Paper
                component={Link}
                href={tool.route}
                elevation={4}
                tabIndex={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 4,
                  background: idx % 2 === 0 ? "#fffde7" : "#fff",
                  border: `1.5px solid #f5f5f5`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover, &:focus": {
                    transform: "translateY(-6px) scale(1.025)",
                    boxShadow: "0 8px 32px #ffd60033",
                    background: "#fffde7",
                  },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  minHeight: 170,
                  cursor: "pointer",
                  textDecoration: "none", // Prevents link underline
                  outline: "none",
                }}
              >
                <Box sx={{ mb: 2, color: "#1976d2", display: "flex", alignItems: "center" }}>
                  {tool.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 0.7,
                    color: "#222",
                    fontSize: 20,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {tool.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.7 }}>
                  {getToolDescription(tool.label)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </motion.div>
  );
}
