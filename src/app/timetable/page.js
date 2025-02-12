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
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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
  // State for timetable events
  const [timetable, setTimetable] = useState([]);
  // State for programme data fetched from MongoDB
  const [programmeData, setProgrammeData] = useState([]);
  // Selected programme filter (only one dropdown)
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [refresh, setRefresh] = useState(Date.now());

  // New event state – date and time are stored as Date objects.
  // When submitted, these will be combined into a single fullDateTime.
  const [newEvent, setNewEvent] = useState({
    programme: "",
    course: "",
    lecturer: "",
    date: null,
    time: null,
    group: "",
    room: "",
  });

  // Fetch programme data from MongoDB (via /api/programmeData)
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
      .catch((error) =>
        console.error("Error fetching programme data from API:", error)
      );
  }, []);

  // Fetch timetable events whenever the selected programme changes.
  useEffect(() => {
    fetchTimetable();
  }, [selectedProgramme]);

  const fetchTimetable = () => {
    fetch("/api/timetable")
      .then((res) => res.json())
      .then((data) => {
        setTimetable(data.data || []);
      })
      .catch((error) =>
        console.error("Error fetching timetable:", error)
      );
  };

  // Filter events based on the selected programme.
  // (Assumes each event document contains a "programme" field.)
  const filteredEvents = Array.isArray(timetable)
    ? timetable.filter((entry) => entry.programme === selectedProgramme)
    : [];

  // Handle changes in the programme filter.
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

  // Handle text field changes in the new event form.
  const handleNewEventChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submission of a new event.
  const handleSubmitEvent = () => {
    // Combine the selected date and time into one Date object.
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

    // Prepare the event object for submission.
    const eventToSubmit = {
      ...newEvent,
      fullDateTime: combinedDateTime, // This field will be stored in MongoDB.
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
          // Clear non-programme fields after successful addition.
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
            <Select
              value={selectedProgramme}
              onChange={handleProgrammeChange}
            >
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
            {/* Course Dropdown */}
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
                  const courses = currentProgramme ? currentProgramme.courses : [];
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
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmitEvent}
              >
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
          <FullCalendar
            key={refresh}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,timeGridDay",
            }}
            events={filteredEvents.map((entry) => {
              // Use fullDateTime as the event start.
              // Here we assume each event lasts 1 hour.
              const start = new Date(entry.fullDateTime);
              const end = new Date(start.getTime() + 60 * 60 * 1000);
              return {
                title: `${entry.course} (${entry.lecturer})`,
                start: start,
                end: end,
                extendedProps: { room: entry.room },
              };
            })}
            // Update slot range to display all hours so events at midnight are visible.
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            height="auto"
          />
        </Grid>
      </Grid>
    </Container>
  );
}
