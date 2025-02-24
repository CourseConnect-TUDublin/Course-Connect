"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { Search, Notifications } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import CalendarWidget from "../../components/CalendarWidget";
import { motion } from "framer-motion";

export default function CourseConnectDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for timetable events and refresh trigger
  const [timetable, setTimetable] = useState([]);
  const [refresh, setRefresh] = useState(Date.now());

  // Redirect if not authenticated
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  // Define fetchTimetable with useCallback for stable dependencies
  const fetchTimetable = useCallback(async () => {
    try {
      const userId = session?.user?.id || session?.user?.sub;
      const res = await fetch(`/api/timetable?userId=${userId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setTimetable(data.data);
        setRefresh(Date.now());
      } else {
        console.error("Error fetching timetable:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [session]);

  // Fetch timetable data when session exists
  useEffect(() => {
    if (session) {
      fetchTimetable();
    }
  }, [session, fetchTimetable]);

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

        {/* Main content container */}
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, sm: 3 },
            py: { xs: 3, sm: 4 },
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, letterSpacing: "-0.5px", mb: 1 }}
          >
            Welcome, {userName}!
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ mb: { xs: 2, sm: 3 }, color: "#666666" }}
          >
            Here is your agenda for today
          </Typography>

          {/* Grid Layout for Widgets */}
          <Grid container spacing={4}>
            {/* Urgent Tasks Widget */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, letterSpacing: "-0.25px" }}
                >
                  Urgent Tasks
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Finish OOP Project Work{" "}
                  <Typography
                    component="span"
                    color="secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    • Today
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Major Group Diary{" "}
                  <Typography
                    component="span"
                    color="secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    • Today
                  </Typography>
                </Typography>
              </Paper>
            </Grid>

            {/* Weekly Calendar Widget */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, letterSpacing: "-0.25px" }}
                >
                  Weekly Calendar
                </Typography>
                <CalendarWidget events={timetable} refresh={refresh} />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </motion.div>
  );
}
