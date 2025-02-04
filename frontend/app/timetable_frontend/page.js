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
} from "@mui/material";
import Link from "next/link";

// Import Date & Time Pickers from MUI X (v6)
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Import FullCalendar and its plugins
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

// Helper function to convert "HH:mm AM/PM" to 24-hour "HH:mm" format
const convertTimeTo24Hour = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  if (modifier.toUpperCase() === "PM" && hours !== "12") {
    hours = String(parseInt(hours, 10) + 12);
  }
  if (modifier.toUpperCase() === "AM" && hours === "12") {
    hours = "00";
  }
  return `${hours.padStart(2, "0")}:${minutes}`;
};

const Navbar = () => (
  <AppBar position="static" sx={{ backgroundColor: "#1565C0" }}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        University Timetable
      </Typography>
      <Link href="/" passHref>
        <Button color="inherit">🏠 Home</Button>
      </Link>
    </Toolbar>
  </AppBar>
);

export default function TimetableFrontend() {
  // newEntry stores date and time as Date objects (initially null)
  const [newEntry, setNewEntry] = useState({
    course: "",
    lecturer: "",
    room: "",
    date: null,
    time: null,
  });
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  // viewMode toggles between "table" and "calendar"
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await fetch("/api/timetable");
      const data = await res.json();
      setTimetable(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };

  const handleAddEntry = async () => {
    if (
      !newEntry.course ||
      !newEntry.lecturer ||
      !newEntry.room ||
      !newEntry.date ||
      !newEntry.time
    ) {
      alert("All fields are required!");
      return;
    }

    // Format the date to "DD/MM/YYYY"
    const formattedDate = newEntry.date.toLocaleDateString("en-GB");
    // Format the time to "HH:mm AM/PM"
    const formattedTime = newEntry.time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const updatedEntry = {
      ...newEntry,
      date: formattedDate,
      time: formattedTime,
    };

    console.log("Adding New Entry:", updatedEntry);

    try {
      const res = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEntry),
      });
      await res.json();
      setNewEntry({ course: "", lecturer: "", room: "", date: null, time: null });
      fetchTimetable();
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  // Prepare calendar events: convert stored date ("DD/MM/YYYY") to ISO date,
  // convert time to 24-hour format, and build an ISO datetime string.
  const calendarEvents = timetable.map((entry) => {
    const parts = entry.date.split("/");
    const isoDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    const time24 = convertTimeTo24Hour(entry.time);
    const isoDatetime = isoDate + "T" + time24;
    return {
      id: entry.id.toString(),
      title: `${entry.course} (${entry.lecturer})`,
      start: new Date(isoDatetime),
      extendedProps: { room: entry.room },
    };
  });

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
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={newEntry.date}
                  onChange={(newDate) =>
                    setNewEntry({ ...newEntry, date: newDate })
                  }
                  slots={{ textField: TextField }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Select Time"
                  value={newEntry.time}
                  onChange={(newTime) =>
                    setNewEntry({ ...newEntry, time: newTime })
                  }
                  slots={{ textField: TextField }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
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
          {loading ? (
            <Typography sx={{ mt: 3, textAlign: "center" }}>
              Loading timetable...
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#1976D2" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Course</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Lecturer</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Room</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timetable.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.id}</TableCell>
                      <TableCell>{entry.course}</TableCell>
                      <TableCell>{entry.lecturer}</TableCell>
                      <TableCell>{entry.room}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Container>
  );
}
