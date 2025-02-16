"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  AppBar,
  Toolbar,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CalendarWidget from "../../components/CalendarWidget"; // <-- Import your new component

const Navbar = () => {
  const router = useRouter();
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1565C0" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          TU Dublin - Timetable
        </Typography>
        <Button color="inherit" onClick={() => router.push("/dashboard")}>
          Home
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [programmeData, setProgrammeData] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [refresh, setRefresh] = useState(Date.now());

  // New event state – date and time are stored as Date objects
  const [newEvent, setNewEvent] = useState({
    programme: "",
    course: "",
    lecturer: "",
    date: null,
    time: null,
    group: "",
    room: "",
  });

  // 1. Fetch programme data from /api/programmeData
  useEffect(() => {
    fetch("/api/programmeData")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProgrammeData(data.data);
          if (data.data.length > 0) {
            const initialProgramme = data.data[0];
            setSelectedProgramme(initialProgramme.name);
            setNewEvent((prev) => ({
              ...prev,
              programme: initialProgramme.name,
              course: initialProgramme.courses[0] || "",
            }));
          }
        } else {
          console.error("Failed to load programme data");
        }
      })
      .catch((error) => console.error("Error fetching programme data:", error));
  }, []);

  // 2. Fetch timetable events whenever the selected programme changes
  useEffect(() => {
    fetchTimetable();
  }, [selectedProgramme]);

  const fetchTimetable = () => {
    fetch("/api/timetable")
      .then((res) => res.json())
      .then((data) => {
        setTimetable(data.data || []);
      })
      .catch((error) => console.error("Error fetching timetable:", error));
  };

  // 3. Filter events by the selected programme
  const filteredEvents = Array.isArray(timetable)
    ? timetable.filter((entry) => entry.programme === selectedProgramme)
    : [];

  // Handle programme dropdown change
  const handleProgrammeChange = (event) => {
    const programmeName = event.target.value;
    setSelectedProgramme(programmeName);
    const currentProgramme = programmeData.find(
      (prog) => prog.name === programmeName
    );
    setNewEvent((prev) => ({
      ...prev,
      programme: programmeName,
      course:
        currentProgramme && currentProgramme.courses.length > 0
          ? currentProgramme.courses[0]
          : "",
    }));
    setRefresh(Date.now());
  };

  // Handle form field changes for newEvent
  const handleNewEventChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value,
    });
  };

  // Combine date/time and submit new event
  const handleSubmitEvent = () => {
    const combinedDateTime =
      newEvent.date && newEvent.time
        ? new Date(
            newEvent.date.getFullYear(),
            newEvent.date.getMonth(),
            newEvent.date.getDate(),
            newEvent.time.getHours(),
            newEvent.time.getMinutes(),
            newEvent.time.getSeconds()
          )
        : null;

    const eventToSubmit = {
      ...newEvent,
      fullDateTime: combinedDateTime,
    };

    fetch("/api/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventToSubmit),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchTimetable();
          // Reset some fields
          setNewEvent((prev) => ({
            ...prev,
            lecturer: "",
            date: null,
            time: null,
            group: "",
            room: "",
          }));
        } else {
          console.error("Failed to add event:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error adding event:", error);
      });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}>
      <Navbar />
      <Grid container spacing={3}>
        {/* Left Sidebar: Programme Filter & New Event Form */}
        <Grid item xs={3}>
          <Typography variant="h6" gutterBottom>
            Select Programme
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Programme</InputLabel>
            <Select value={selectedProgramme} onChange={handleProgrammeChange}>
              {programmeData.map((prog) => (
                <MenuItem key={prog.name} value={prog.name}>
                  {prog.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Add New Event
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Course</InputLabel>
              <Select
                name="course"
                value={newEvent.course}
                onChange={handleNewEventChange}
              >
                {(() => {
                  const currentProgramme = programmeData.find(
                    (prog) => prog.name === selectedProgramme
                  );
                  const courses = currentProgramme
                    ? currentProgramme.courses
                    : [];
                  return courses.map((course) => (
                    <MenuItem key={course} value={course}>
                      {course}
                    </MenuItem>
                  ));
                })()}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="lecturer"
              label="Lecturer"
              fullWidth
              value={newEvent.lecturer}
              onChange={handleNewEventChange}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={newEvent.date}
                onChange={(newValue) =>
                  setNewEvent((prev) => ({ ...prev, date: newValue }))
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="dense" />
                )}
              />
              <TimePicker
                label="Start Time"
                value={newEvent.time}
                onChange={(newValue) =>
                  setNewEvent((prev) => ({ ...prev, time: newValue }))
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="dense" />
                )}
              />
            </LocalizationProvider>
            <TextField
              margin="dense"
              name="group"
              label="Group"
              fullWidth
              value={newEvent.group}
              onChange={handleNewEventChange}
            />
            <TextField
              margin="dense"
              name="room"
              label="Room"
              fullWidth
              value={newEvent.room}
              onChange={handleNewEventChange}
            />
            <Box mt={2}>
              <Button variant="contained" fullWidth onClick={handleSubmitEvent}>
                Add Event
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Right Side: Timetable Display */}
        <Grid item xs={9}>
          <Typography variant="h4" align="center" gutterBottom>
            Weekly Timetable
          </Typography>
          {/* Use the new CalendarWidget here */}
          <CalendarWidget events={filteredEvents} refresh={refresh} />
        </Grid>
      </Grid>
    </Container>
  );
}
