"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import {
  Home,
  Dashboard as DashboardIcon,
  CalendarToday,
  Assignment,
  CheckBox,
  People,
  Chat,
  Help,
  Settings,
  Search,
  Notifications,
} from "@mui/icons-material";
import CalendarWidget from "../../components/CalendarWidget";

const drawerWidth = 240;

export default function CourseConnectDashboard() {
  // Get the current user from AuthContext
  const { user } = useAuth();
  const userName = user ? user.name : "Guest";

  // Dummy timetable events state – in a real app, fetch from your backend
  const [timetable, setTimetable] = useState([]);
  // Refresh trigger for CalendarWidget
  const [refresh, setRefresh] = useState(Date.now());

  // Dummy fetch function – replace with actual API call as needed
  const fetchTimetable = () => {
    fetch("/api/timetable")
      .then((res) => res.json())
      .then((data) => {
        setTimetable(data.data || []);
      })
      .catch((error) => console.error("Error fetching timetable:", error));
  };

  // Initially fetch timetable events on component mount
  useEffect(() => {
    fetchTimetable();
  }, []);

  // For this example, assume the dashboard shows events for "TU860 YR3"
  const filteredEvents = timetable.filter(
    (entry) => entry.programme === "TU860 YR3"
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#2D2D3A",
            color: "white",
          },
        }}
      >
        <Toolbar />
        <List>
          {[
            "Home",
            "Dashboard",
            "Timetable",
            "Assignments",
            "To-Do",
            "Study-Buddy",
            "Archive",
            "Calendar",
            "Help Center",
            "Settings",
          ].map((text, index) => (
            <ListItem
              key={text}
              component={Link}
              href={
                text === "Home"
                  ? "/dashboard"
                  : text === "Timetable"
                  ? "/timetable"
                  : text.toLowerCase().replace(/\s+/g, "")
              }
              sx={{ textDecoration: "none", color: "white" }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                {index === 0 ? (
                  <Home />
                ) : index === 1 ? (
                  <DashboardIcon />
                ) : index === 2 ? (
                  <CalendarToday />
                ) : index === 3 ? (
                  <Assignment />
                ) : index === 4 ? (
                  <CheckBox />
                ) : index === 5 ? (
                  <People />
                ) : index === 6 ? (
                  <Chat />
                ) : index === 7 ? (
                  <CalendarToday />
                ) : index === 8 ? (
                  <Help />
                ) : (
                  <Settings />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Top Navigation */}
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
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
          </Toolbar>
        </AppBar>
        <Toolbar />

        {/* Dashboard Content */}
        <Box sx={{ mt: 2 }}>
          {/* Welcome & Subheading */}
          <Typography variant="h5" gutterBottom>
            Welcome, {userName}!
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Here is your agenda for today
          </Typography>

          {/* Main Grid Layout */}
          <Grid container spacing={3}>
            {/* Top Row: Urgent Tasks & Uncomplete Flashcards */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {/* Urgent Tasks */}
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
                    <Typography variant="body1">
                      CA 2 Revision{" "}
                      <Typography component="span" color="secondary">
                        • Today
                      </Typography>
                    </Typography>
                  </Paper>
                </Grid>
                {/* Uncomplete Flashcards */}
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={3}
                    sx={{ p: 2, backgroundColor: "#F5F5F5", height: "100%" }}
                  >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Uncomplete Flashcards
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <Paper
                        sx={{
                          p: 1,
                          minWidth: "100px",
                          backgroundColor: "#F2E7FE",
                          cursor: "pointer",
                        }}
                      >
                        <Typography>#Research</Typography>
                      </Paper>
                      <Paper
                        sx={{
                          p: 1,
                          minWidth: "100px",
                          backgroundColor: "#E3FCEF",
                          cursor: "pointer",
                        }}
                      >
                        <Typography>#SWOT analysis</Typography>
                      </Paper>
                      <Paper
                        sx={{
                          p: 1,
                          minWidth: "100px",
                          backgroundColor: "#FFF5DA",
                          cursor: "pointer",
                        }}
                      >
                        <Typography>#Operations</Typography>
                      </Paper>
                      <Paper
                        sx={{
                          p: 1,
                          minWidth: "100px",
                          backgroundColor: "#FFDCE5",
                          cursor: "pointer",
                        }}
                      >
                        <Typography>#Strategy design</Typography>
                      </Paper>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Second Row: Calendar Section */}
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{ p: 2, backgroundColor: "#F5F5F5", mt: 2 }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Your Weekly Calendar
                </Typography>
                <CalendarWidget events={filteredEvents} refresh={refresh} />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
