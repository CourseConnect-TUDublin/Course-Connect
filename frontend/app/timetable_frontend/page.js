"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  AppBar,
  Toolbar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Import Date & Time Pickers from MUI X
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Import FullCalendar and required plugins (if needed)
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

// Import addDays from date-fns for recurring event calculations
import { addDays } from "date-fns";

const Navbar = () => (
  <AppBar position="static" sx={{ backgroundColor: "#1565C0" }}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        University Timetable
      </Typography>
      <Link href="/" passHref legacyBehavior>
        <Button color="inherit">🏠 Home</Button>
      </Link>
    </Toolbar>
  </AppBar>
);

export default function TimetableFrontend() {
  const { data: session } = useSession(); // Get the logged-in user

  const [newEntry, setNewEntry] = useState({
    course: "",
    lecturer: "",
    room: "",
    date: null,
    time: null,
    recurring: false
  });

  const [timetable, setTimetable] = useState([]);
  const [programmeData, setProgrammeData] = useState([]); // Store available modules
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    fetchTimetable();
    fetchProgrammeData(); // Load available modules
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await fetch("/api/timetable", {
        method: "GET",
        credentials: "include", // Ensure cookies are sent
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        setTimetable(data.data);
      } else {
        console.error("❌ Error fetching timetable:", data.error);
      }
      setLoading(false);
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      setLoading(false);
    }
  };

  const fetchProgrammeData = async () => {
    try {
      const res = await fetch("/api/programmeData");
      const data = await res.json();
      if (data.success) {
        setProgrammeData(data.data);
      } else {
        console.error("Error loading programme data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching programme data:", error);
    }
  };

  const handleAddEntry = async () => {
    if (!session?.user?.id) {
      alert("Error: User not logged in.");
      return;
    }

    if (!newEntry.course || !newEntry.lecturer || !newEntry.room || !newEntry.date || !newEntry.time) {
      alert("All fields are required!");
      return;
    }

    // Ensure correct date & time format
    const formattedDate = newEntry.date.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const formattedTime = newEntry.time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    const updatedEntry = {
      ...newEntry,
      date: formattedDate,
      time: formattedTime,
      userId: session.user.id // Send userId
    };

    console.log("Adding New Entry:", updatedEntry);

    try {
      const res = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are sent
        body: JSON.stringify(updatedEntry)
      });

      const data = await res.json();
      if (data.success) {
        setNewEntry({
          course: "",
          lecturer: "",
          room: "",
          date: null,
          time: null,
          recurring: false
        });
        fetchTimetable();
      } else {
        console.error("Failed to add entry:", data.error);
      }
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  if (loading) {
    return <Typography sx={{ textAlign: "center", mt: 4 }}>Loading timetable...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Navbar />
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

      {viewMode === "table" && (
        <>
          <Typography variant="h6" gutterBottom>
            Add New Schedule
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={newEntry.course}
                  onChange={(e) => setNewEntry({ ...newEntry, course: e.target.value })}
                  label="Course"
                >
                  {programmeData && programmeData.length > 0 ? (
                    programmeData.flatMap((programme) =>
                      programme.courses && programme.courses.length > 0 ? (
                        programme.courses.map((course) => (
                          <MenuItem key={course} value={course}>
                            {course}
                          </MenuItem>
                        ))
                      ) : []
                    )
                  ) : (
                    <MenuItem value="">
                      <em>No courses available</em>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Lecturer"
                fullWidth
                value={newEntry.lecturer}
                onChange={(e) => setNewEntry({ ...newEntry, lecturer: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Room Number"
                fullWidth
                value={newEntry.room}
                onChange={(e) => setNewEntry({ ...newEntry, room: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={newEntry.date}
                  onChange={(newDate) => setNewEntry({ ...newEntry, date: newDate })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Select Time"
                  value={newEntry.time}
                  onChange={(newTime) => setNewEntry({ ...newEntry, time: newTime })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }} onClick={handleAddEntry}>
            Add Schedule
          </Button>
        </>
      )}
    </Container>
  );
}
