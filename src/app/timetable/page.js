"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CalendarWidget from "../../components/CalendarWidget";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// Updated Navbar with modern, minimal design
function Navbar() {
  const router = useRouter();
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #eaeaea",
        boxShadow: "none",
        mb: 3,
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: "#333333" }}>
          TU Dublin - Timetable
        </Typography>
        <Link href="/dashboard" passHref legacyBehavior>
          <Button color="primary" sx={{ textTransform: "none" }}>
            Home
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default function Timetable() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [timetable, setTimetable] = useState([]); // Always an array
  const [programmeData, setProgrammeData] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [refresh, setRefresh] = useState(Date.now());

  // New event state – date and time stored as Date objects; includes recurring flag.
  const [newEvent, setNewEvent] = useState({
    programme: "",
    course: "",
    lecturer: "",
    date: null,
    time: null,
    group: "",
    room: "",
    recurring: false,
  });

  // Clear timetable state (client-side)
  const clearTimetable = () => {
    setTimetable([]);
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      console.log("No session found, calling signIn()");
      signIn();
    }
  }, [session, status]);

  // 1. Fetch programme data from /api/programmeData
  useEffect(() => {
    if (!session) return;
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
  }, [session]);

  // 2. Fetch timetable events whenever selectedProgramme or session changes
  const fetchTimetable = useCallback(async () => {
    if (!session) return;
    const userId = session.user.id || session.user.sub;
    const url = `/api/timetable?userId=${userId}`;
    console.log("Fetching timetable from:", url);
    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setTimetable(data.data || []); // Ensure timetable is always an array
      } else {
        toast.error("Failed to fetch timetable data: " + data.error);
      }
    } catch (error) {
      toast.error("Error fetching timetable data");
      console.error("Error fetching timetable:", error);
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    fetchTimetable();
  }, [selectedProgramme, session, fetchTimetable]); // Added fetchTimetable as dependency

  // 3. Filter events by selected programme
  const filteredEvents = Array.isArray(timetable)
    ? timetable.filter((entry) => entry.programme === selectedProgramme)
    : [];

  // Handle programme dropdown change
  const handleProgrammeChange = (e) => {
    const programmeName = e.target.value;
    setSelectedProgramme(programmeName);
    const currentProgramme = programmeData.find((prog) => prog.name === programmeName);
    setNewEvent((prev) => ({
      ...prev,
      programme: programmeName,
      course: currentProgramme?.courses?.length > 0 ? currentProgramme.courses[0] : "",
    }));
    setRefresh(Date.now());
  };

  // Handle form field changes for newEvent (for text inputs)
  const handleNewEventChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Combine date/time and submit new event, including userId and recurring flag
  const handleSubmitEvent = async () => {
    if (!session || !session.user?.id) {
      alert("Error: User not logged in.");
      return;
    }
    if (
      !newEvent.course ||
      !newEvent.lecturer ||
      !newEvent.room ||
      !newEvent.date ||
      !newEvent.time ||
      !newEvent.group
    ) {
      alert("All fields are required!");
      return;
    }
    // Combine date and time into a Date object for fullDateTime
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

    const userId = session.user.id || session.user.sub;
    if (!userId) {
      alert("User information is still loading. Please try again.");
      return;
    }

    const eventToSubmit = {
      ...newEvent,
      fullDateTime: combinedDateTime ? combinedDateTime.toISOString() : null,
      userId,
    };
    console.log("Adding New Entry:", eventToSubmit);

    try {
      const res = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(eventToSubmit),
      });
      const data = await res.json();
      if (data.success) {
        console.log("Entry added successfully:", data.data);
        // Reset fields (retain programme and course)
        setNewEvent((prev) => ({
          ...prev,
          lecturer: "",
          date: null,
          time: null,
          group: "",
          room: "",
          recurring: false,
        }));
        fetchTimetable();
      } else {
        console.error("Failed to add entry:", data.error);
        alert("Failed to add entry: " + data.error);
      }
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  if (status === "loading" || !session) {
    return (
      <Typography sx={{ textAlign: "center", p: 4 }}>
        Loading...
      </Typography>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Container maxWidth="xl" sx={{ mt: 5 }}>
        <Navbar />
        <Grid container spacing={4}>
          {/* Left Panel: Programme Filter & New Event Form */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 2,
                backgroundColor: "#fafafa",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Select Programme
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Programme</InputLabel>
                <Select
                  value={selectedProgramme}
                  onChange={handleProgrammeChange}
                  label="Programme"
                >
                  {programmeData.map((prog) => (
                    <MenuItem key={prog.name} value={prog.name}>
                      {prog.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Add New Event
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Course</InputLabel>
                <Select
                  name="course"
                  value={newEvent.course}
                  onChange={handleNewEventChange}
                  label="Course"
                >
                  {programmeData.length > 0 ? (
                    programmeData.flatMap((programme) =>
                      (programme.courses || []).map((course) => (
                        <MenuItem key={course} value={course}>
                          {course}
                        </MenuItem>
                      ))
                    )
                  ) : (
                    <MenuItem value="">
                      <em>No courses available</em>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

              <TextField
                margin="dense"
                name="lecturer"
                label="Lecturer"
                fullWidth
                value={newEvent.lecturer || ""}
                onChange={handleNewEventChange}
              />
              <TextField
                margin="dense"
                name="room"
                label="Room Number"
                fullWidth
                value={newEvent.room || ""}
                onChange={handleNewEventChange}
              />
              <TextField
                margin="dense"
                name="group"
                label="Group"
                fullWidth
                value={newEvent.group || ""}
                onChange={handleNewEventChange}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={newEvent.date}
                  onChange={(val) =>
                    setNewEvent((prev) => ({ ...prev, date: val }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="dense" />
                  )}
                />
                <TimePicker
                  label="Select Time"
                  value={newEvent.time}
                  onChange={(val) =>
                    setNewEvent((prev) => ({ ...prev, time: val }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="dense" />
                  )}
                />
              </LocalizationProvider>
              {/* Recurring Weekly Option */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newEvent.recurring || false}
                    onChange={(e) =>
                      setNewEvent((prev) => ({ ...prev, recurring: e.target.checked }))
                    }
                    color="primary"
                  />
                }
                label="Recurring Weekly"
                sx={{ mt: 1 }}
              />

              <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" color="error" onClick={clearTimetable}>
                  Clear Timetable
                </Button>
                <Button variant="contained" onClick={handleSubmitEvent}>
                  Add Event
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Right Panel: Calendar Widget Display */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 2,
                backgroundColor: "#fafafa",
              }}
            >
              <Typography variant="h4" align="center" gutterBottom>
                Weekly Timetable
              </Typography>
              <CalendarWidget events={filteredEvents} refresh={refresh} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
}
