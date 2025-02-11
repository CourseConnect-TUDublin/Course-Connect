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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

// Navbar component with Home button redirect
const Navbar = () => {
  const router = useRouter();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1565C0" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          University Timetable
        </Typography>
        <Button color="inherit" onClick={() => router.push("/dashboard")}>
          Home
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default function Timetable() {
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

  // Updated generateRecurringEvents function that handles both legacy and new schema fields.
  const generateRecurringEvents = (entry) => {
    let occurrences = [];

    // Determine the base date and time from the entry.
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

    // Generate recurring events (up to 12 occurrences)
    for (let i = 0; i < 12; i++) {
      let eventDate = new Date(currentDate);
      const fullDateTime = new Date(`${eventDate.toISOString().split("T")[0]}T${baseTimeString}`);

      if (isNaN(fullDateTime.getTime())) {
        console.error("Invalid date-time:", fullDateTime);
        continue;
      }

      // Use entry._id (from MongoDB) if available; fallback to entry.id.
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

  const calendarEvents = timetable.flatMap((entry) =>
    generateRecurringEvents(entry)
  );

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

      {viewMode === "calendar" && (
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
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
    </Container>
  );
}
