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
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Search,
  Notifications,
  Brightness4,
  Brightness7,
  Today,
  Event,
  Timer,
  Announcement,
  Note,
  CheckCircle,
  BarChart,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import CalendarWidget from "../../components/CalendarWidget";
import { motion } from "framer-motion";

export default function CourseConnectDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Dark mode
  const [darkMode, setDarkMode] = useState(false);
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { mode: darkMode ? "dark" : "light", primary: { main: "#1976d2" } },
      }),
    [darkMode]
  );

  // Summary metrics
  const [metrics] = useState({
    tasksDue: 3,
    classesThisWeek: 5,
    upcomingDeadlines: 2,
    focusStreak: 4,
  });

  // Flashcards
  const [flashcards] = useState([
    { label: "Math Definitions", route: "/flashcards/math" },
    { label: "History Dates", route: "/flashcards/history" },
    { label: "Biology Terms", route: "/flashcards/biology" },
  ]);

  // Quick Actions
  const quickActions = [
    { label: "Timetable", route: "/timetable" },
    { label: "Assignments", route: "/assignments" },
    { label: "Task Manager", route: "/TaskManager" },
    { label: "To-Do", route: "/todo" },
  ];

  // Announcements
  const [announcements] = useState([
    { text: "New dark mode available!", route: "/announcements" },
    { text: "Submit feedback survey by end of week.", route: "/announcements" },
  ]);

  // Quick Note (auto-save)
  const [note, setNote] = useState("");
  useEffect(() => {
    const saved = localStorage.getItem("quickNote");
    if (saved) setNote(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("quickNote", note);
  }, [note]);

  // Focus timer
  const FOCUS_DURATION = 25 * 60;
  const [focusTime, setFocusTime] = useState(FOCUS_DURATION);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    let timer;
    if (running && focusTime > 0) {
      timer = setTimeout(() => setFocusTime(focusTime - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [running, focusTime]);
  const mins = String(Math.floor(focusTime / 60)).padStart(2, "0");
  const secs = String(focusTime % 60).padStart(2, "0");

  // Timetable
  const [timetable, setTimetable] = useState([]);
  const [refresh, setRefresh] = useState(Date.now());
  const fetchTimetable = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/timetable?userId=${session.user.id}`);
      const data = await res.json();
      if (data.success) {
        setTimetable(data.data);
        setRefresh(Date.now());
      }
    } catch (err) {
      console.error(err);
    }
  }, [session]);
  useEffect(() => {
    if (status !== "loading" && !session) router.push("/login");
    fetchTimetable();
  }, [session, status, router, fetchTimetable]);

  const userName = session?.user?.email || "Guest";

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <CssBaseline />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          {/* AppBar */}
          <AppBar position="fixed" elevation={1}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Course Connect
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                <IconButton onClick={() => router.push("/search")}>
                  <Search />
                </IconButton>
                <IconButton onClick={() => router.push("/notifications")}>
                  <Notifications />
                </IconButton>
                <Avatar sx={{ ml: 2 }} />
                <Typography sx={{ ml: 2, fontWeight: 600 }}>{userName}</Typography>
                <Button color="inherit" onClick={() => signOut({ callbackUrl: "/login" })}>
                  Sign Out
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <Toolbar />

          <Box sx={{ px: { xs: 2, md: 4 }, py: 4, mt: 2, maxWidth: 1400, mx: "auto" }}>
            {/* Summary Cards */}
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Welcome, {userName}!
            </Typography>
            <Grid container spacing={2} mb={4}>
              {[
                { icon: Event, title: "Tasks Due", value: metrics.tasksDue, route: "/TaskManager" },
                { icon: Today, title: "Classes This Week", value: metrics.classesThisWeek, route: "/timetable" },
                { icon: CheckCircle, title: "Deadlines", value: metrics.upcomingDeadlines, route: "/assignments" },
                { icon: CheckCircle, title: "Focus Streak", value: `${metrics.focusStreak} days`, route: "/focus" },
              ].map((card, i) => (
                <Grid item xs={6} sm={3} key={i}>
                  <CardActionArea onClick={() => router.push(card.route)}>
                    <Card>
                      <CardHeader avatar={<card.icon />} title={card.title} />
                      <CardContent>
                        <Typography variant="h5">{card.value}</Typography>
                      </CardContent>
                    </Card>
                  </CardActionArea>
                </Grid>
              ))}
            </Grid>

            {/* Three-column layout */}
            <Grid container spacing={3}>
              {/* Left: Flashcards, Quick Actions, Announcements */}
              <Grid item xs={12} md={4} container direction="column" spacing={3}>
                <Grid item>
                  <Card>
                    <CardHeader avatar={<Timer />} title="Flashcards" />
                    <Divider />
                    <List dense>
                      {flashcards.map((f, i) => (
                        <ListItem key={i} button onClick={() => router.push(f.route)}>
                          <ListItemIcon><Event /></ListItemIcon>
                          <ListItemText primary={f.label} />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>
                <Grid item>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {quickActions.map((act) => (
                        <Button key={act.route} size="small" onClick={() => router.push(act.route)}>
                          {act.label}
                        </Button>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item>
                  <Card>
                    <CardHeader avatar={<Announcement />} title="Announcements" />
                    <Divider />
                    <List dense>
                      {announcements.map((a, i) => (
                        <ListItem key={i} button onClick={() => router.push(a.route)}>
                          <ListItemIcon><Announcement /></ListItemIcon>
                          <ListItemText primary={a.text} />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>
              </Grid>

              {/* Center: Timetable */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>Upcoming Timetable</Typography>
                  <CalendarWidget events={timetable} refresh={refresh} />
                </Paper>
              </Grid>

              {/* Right: Focus Timer, Progress, Quick Note */}
              <Grid item xs={12} md={4} container direction="column" spacing={3}>
                <Grid item>
                  <Card>
                    <CardHeader avatar={<Timer />} title="Focus Timer" />
                    <Divider />
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h3">{mins}:{secs}</Typography>
                      <Button variant="contained" size="small" onClick={() => setRunning(!running)} sx={{ mt: 1 }}>
                        {running ? "Pause" : "Start"}
                      </Button>
                      <Button size="small" onClick={() => {
                        setRunning(false);
                        setFocusTime(FOCUS_DURATION);
                        router.push("/study-session/log");
                      }}>End</Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card>
                    <CardHeader avatar={<BarChart />} title="Study Progress" />
                    <CardContent sx={{ textAlign: "center" }}>
                      <CircularProgress variant="determinate" value={65} size={60} />
                      <Typography variant="caption" display="block" mt={1}>65% Goal</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item>
                  <Card>
                    <CardHeader avatar={<Note />} title="Quick Note" />
                    <Divider />
                    <CardContent>
                      <TextField
                        fullWidth multiline rows={3}
                        placeholder="Jot something…"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
}
