"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed
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
  Card,
  CardContent,
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

const drawerWidth = 240;

export default function CourseConnectDashboard() {
  // Get the current user from AuthContext
  const { user } = useAuth();

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
            "Chat Room",
            "Calendar",
            "Help Center",
            "Settings",
          ].map((text, index) => (
            <ListItem
              key={text}
              component={Link}
              href={
                text === "Home"
                  ? "/dashboard" // redirects to /dashboard
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
              {user ? user.name : "Guest"}
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />

        {/* Dashboard Content */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
            Welcome, {user ? user.name : "Guest"}!
          </Typography>
          <Grid container spacing={3}>
            {/* Task Management Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Task Management</Typography>
                  <Typography variant="body1">
                    Manage your daily tasks efficiently.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    component={Link}
                    href="/taskmanager"
                  >
                    Go to Task Manager
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            {/* Learning Insights Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Learning Insights</Typography>
                  <Typography variant="body1">
                    Track your learning progress.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    component={Link}
                    href="/learninginsights"
                  >
                    View Insights
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            {/* Timetable Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Timetable</Typography>
                  <Typography variant="body1">
                    View your course schedule.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    component={Link}
                    href="/timetable"
                  >
                    Go to Timetable
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
