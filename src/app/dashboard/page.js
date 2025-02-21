"use client";

import React, { useState, useEffect } from "react";
import { CssBaseline, AppBar, Toolbar, Typography, IconButton, Button, Box, Grid, Paper } from "@mui/material";
import { Search, Notifications } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import CalendarWidget from "../../components/CalendarWidget";

export default function CourseConnectDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State to hold timetable events and refresh trigger
  const [timetable, setTimetable] = useState([]);
  const [refresh, setRefresh] = useState(Date.now());

  // Redirect if not authenticated
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  // Fetch timetable data if session exists
  useEffect(() => {
    if (session) {
      fetchTimetable();
    }
  }, [session]);

  const fetchTimetable = async () => {
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
  };

  const userName = session?.user?.email || "Guest";

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <CssBaseline />
      {/* Top Navigation (global Sidebar is provided by the layout) */}
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          backgroundColor: "white",
          color: "black",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Course Connect
          </Typography>
          <IconButton color="inherit">
            <Search />
          </IconButton>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <Typography variant="body1" sx={{ ml: 2 }}>
            {userName}
          </Typography>
          <Button
            color="secondary"
            onClick={() => signOut({ callbackUrl: "/login" })}
            sx={{ ml: 2 }}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />

      {/* Dashboard Content */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          Welcome, {userName}!
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Here is your agenda for today
        </Typography>

        {/* Main Grid Layout */}
        <Grid container spacing={3}>
          {/* Urgent Tasks Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{ p: 2, backgroundColor: "#F5F5F5", height: "100%" }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Urgent Tasks
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Finish OOP Project Work{" "}
                <Typography component="span" color="secondary">
                  • Today
                </Typography>
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Major Group Diary{" "}
                <Typography component="span" color="secondary">
                  • Today
                </Typography>
              </Typography>
            </Paper>
          </Grid>

          {/* Weekly Calendar Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{ p: 2, backgroundColor: "#F5F5F5", height: "100%" }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Weekly Calendar
              </Typography>
              <CalendarWidget events={timetable} refresh={refresh} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
