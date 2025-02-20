"use client";

import Link from "next/link";
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from "@mui/material";

import { useSession, signOut } from "next-auth/react";
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
  Button
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
  Notifications
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import CalendarWidget from "../../components/CalendarWidget";

const drawerWidth = 240;

export default function CourseConnectDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [timetable, setTimetable] = useState([]);

  // Always run this effect to handle redirection if not authenticated
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  // Always run this effect to fetch timetable if a session exists
  useEffect(() => {
    if (session) {
      fetchTimetable();
    }
  }, [session]);

  const fetchTimetable = async () => {
    try {
      const res = await fetch("/api/timetable", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        setTimetable(data.data);
      } else {
        console.error("❌ Error fetching timetable:", data.error);
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
    }
  };

  // Even if there's no session, we still call all hooks in order
  const userName = session?.user?.email || "Guest";

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
            color: "white"
          }
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
            "Settings"
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
            color: "black"
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
            <Button color="secondary" onClick={() => signOut({ callbackUrl: "/login" })} sx={{ ml: 2 }}>
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
              </Paper>
            </Grid>

            {/* Weekly Calendar */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{ p: 2, backgroundColor: "#F5F5F5", height: "100%" }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Weekly Calendar
                </Typography>
                <CalendarWidget events={timetable} />
              </Paper>
            </Grid>

            {/* Timetable Table */}
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{ p: 2, backgroundColor: "#F5F5F5", mt: 2 }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Your Timetable
                </Typography>
                <Table>
                  <TableHead sx={{ backgroundColor: "#1976D2" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Course</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Lecturer</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Room</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Time</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Recurring</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {timetable.map((entry) => (
                      <TableRow key={entry._id}>
                        <TableCell>{entry._id}</TableCell>
                        <TableCell>{entry.course}</TableCell>
                        <TableCell>{entry.lecturer}</TableCell>
                        <TableCell>{entry.room}</TableCell>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.time}</TableCell>
                        <TableCell>{entry.recurring ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
