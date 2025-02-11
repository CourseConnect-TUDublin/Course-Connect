"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Container,
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
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

// Sidebar component with navigation links.
// The "Home" link now points to '/dashboard' instead of '/'.
const Sidebar = () => (
  <Drawer
    variant="permanent"
    sx={{
      width: 240,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        width: 240,
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
              ? "/dashboard" // Home now redirects to /dashboard
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
);

// Top navigation bar component.
// The user name is dynamic based on currentUser state.
const TopNav = ({ currentUser }) => {
  const router = useRouter();
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 240px)`,
        ml: `240px`,
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
        <Typography variant="body1">
          {currentUser ? currentUser.name : "Guest"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default function TimetablePage() {
  // Simulated logged-in user; replace this with your authentication logic.
  const [currentUser, setCurrentUser] = useState({ name: "Ian Mugo" });

  const [newEntry, setNewEntry] = useState({
    course: "",
    lecturer: "",
    room: "",
    date: null,
    time: null,
    recurrence: "none",
  });
  const [timetable, setTimetable] = useState([]);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = () => {
    fetch("/api/timetable")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched timetable data:", data);
        setTimetable(data.data);
      })
      .catch((error) => console.error("Error fetching timetable:", error));
  };

  const handleAddEntry = () => {
    console.log("Add Schedule button pressed!");
    console.log("Current newEntry state before submission:", newEntry);

    if (
      !newEntry.course ||
      !newEntry.lecturer ||
      !newEntry.room ||
      !newEntry.date ||
      !newEntry.time
    ) {
      console.error("Missing field detected in newEntry:", newEntry);
      alert("All fields are required!");
      return;
    }

    if (!(newEntry.date instanceof Date) || isNaN(newEntry.date.getTime())) {
      console.error("Invalid date format:", newEntry.date);
      alert("Invalid date selected.");
      return;
    }

    if (!(newEntry.time instanceof Date) || isNaN(newEntry.time.getTime())) {
      console.error("Invalid time format:", newEntry.time);
      alert("Invalid time selected.");
      return;
    }

    const formattedDate = newEntry.date.toISOString().split("T")[0];
    const formattedTime = newEntry.time.toTimeString().split(" ")[0];

    console.log("Formatted Date:", formattedDate);
    console.log("Formatted Time:", formattedTime);

    const updatedEntry = {
      ...newEntry,
      date: formattedDate,
      time: formattedTime,
      recurrence: newEntry.recurrence || "none",
    };

    console.log("Final Entry to be Sent:", updatedEntry);

    fetch("/api/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEntry),
    })
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Response from API:", data);
        setNewEntry({
          course: "",
          lecturer: "",
          room: "",
          date: null,
          time: null,
          recurrence: "none",
        });
        fetchTimetable();
      })
      .catch((error) => console.error("Error adding entry:", error));
  };

  // Generate recurring events from a timetable entry.
  const generateRecurringEvents = (entry) => {
    let occurrences = [];
    let baseDateString, baseTimeString;
    if (entry.date && typeof entry.date === "string" && entry.time && typeof entry.time === "string") {
      baseDateString = entry.date;
      baseTimeString = entry.time;
    } else if (entry.fullDateTime) {
      const dt = new Date(entry.fullDateTime);
      baseDateString = dt.toISOString().split("T")[0];
      baseTimeString = dt.toTimeString().split(" ")[0];
    } else {
      return [];
    }

    let currentDate = new Date(baseDateString);
    if (isNaN(currentDate.getTime())) return [];

    for (let i = 0; i < 12; i++) {
      let eventDate = new Date(currentDate);
      const fullDateTime = new Date(`${eventDate.toISOString().split("T")[0]}T${baseTimeString}`);

      if (isNaN(fullDateTime.getTime())) {
        console.error("Invalid date-time:", fullDateTime);
        continue;
      }

      const eventId = entry._id || entry.id;
      occurrences.push({
        id: `${eventId}-${i}`,
        title: `${entry.course} (${entry.lecturer})`,
        start: fullDateTime,
        extendedProps: { room: entry.room },
      });

      if (entry.recurrence === "weekly") {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (entry.recurrence === "biweekly") {
        currentDate.setDate(currentDate.getDate() + 14);
      } else {
        break;
      }
    }
    return occurrences;
  };

  const calendarEvents = timetable.flatMap((entry) => generateRecurringEvents(entry));

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <TopNav currentUser={currentUser} />
        <Toolbar />
        <Typography variant="h4" gutterBottom sx={{ mt: 3, textAlign: "center" }}>
          University Timetable
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newValue) => setViewMode(newValue || "table")}
          sx={{ display: "flex", justifyContent: "center", mb: 3 }}
        >
          <ToggleButton value="table">Table View</ToggleButton>
          <ToggleButton value="calendar">Calendar View</ToggleButton>
        </ToggleButtonGroup>

        {viewMode === "calendar" && (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            events={calendarEvents}
            height="auto"
          />
        )}

        {viewMode === "table" && (
          <>
            <Typography variant="h6" gutterBottom>
              Add New Schedule
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Course Name"
                  fullWidth
                  value={newEntry.course}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, course: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Lecturer"
                  fullWidth
                  value={newEntry.lecturer}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, lecturer: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Room Number"
                  fullWidth
                  value={newEntry.room}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, room: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Date"
                    value={newEntry.date}
                    onChange={(newDate) => {
                      console.log("Date selected:", newDate);
                      setNewEntry({ ...newEntry, date: newDate });
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Select Time"
                    value={newEntry.time}
                    onChange={(newTime) => {
                      console.log("Time selected:", newTime);
                      setNewEntry({ ...newEntry, time: newTime });
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Recurrence</InputLabel>
                  <Select
                    value={newEntry.recurrence}
                    label="Recurrence"
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, recurrence: e.target.value })
                    }
                  >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="biweekly">Biweekly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleAddEntry}
            >
              Add Schedule
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
