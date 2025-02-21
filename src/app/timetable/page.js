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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CalendarWidget from "../../components/CalendarWidget";
import { toast } from "react-toastify";

function Navbar() {
  const router = useRouter();
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1565C0" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          TU Dublin - Timetable
        </Typography>
        <Link href="/dashboard" passHref>
          <Button color="inherit">Home</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default function Timetable() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
      .catch((error) =>
        console.error("Error fetching programme data:", error)
      );
  }, [session]);

  // 2. Fetch timetable events whenever selectedProgramme or session changes
  useEffect(() => {
    if (!session) return;
    fetchTimetable();
  }, [selectedProgramme, session]);

  const fetchTimetable = async () => {
    if (!session) return; // Wait until session is loaded
    // Use session.user.id if available, otherwise fall back to session.user.sub
    const userId = session.user.id || session.user.sub;
    const url = `/api/timetable?userId=${userId}`;
    console.log("Fetching timetable from:", url);
    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include", // Send cookies
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setTimetable(data.data || []);
      } else {
        toast.error("Failed to fetch timetable data: " + data.error);
      }
    } catch (error) {
      toast.error("Error fetching timetable data");
      console.error("Error fetching timetable:", error);
    }
  };
  

  // 3. Filter events by selected programme
  const filteredEvents = Array.isArray(timetable)
    ? timetable.filter((entry) => entry.programme === selectedProgramme)
    : [];

  // Handle programme dropdown change
  const handleProgrammeChange = (e) => {
    const programmeName = e.target.value;
    setSelectedProgramme(programmeName);
    const currentProgramme = programmeData.find(
      (prog) => prog.name === programmeName
    );
    setNewEvent((prev) => ({
      ...prev,
      programme: programmeName,
      course:
        currentProgramme?.courses?.length > 0 ? currentProgramme.courses[0] : "",
    }));
    setRefresh(Date.now());
  };

  // Handle form field changes for newEvent
  const handleNewEventChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Combine date/time and submit new event, including userId
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

    // Combine date and time into a Date object
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
      userId: session.user.id, // Associate event with the logged-in user
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
        console.log("Entry added successfully:", data.entry);
        // Reset fields except course (keep course selection)
        setNewEvent((prev) => ({
          ...prev,
          lecturer: "",
          date: null,
          time: null,
          group: "",
          room: "",
        }));
        fetchTimetable();
      } else {
        console.error("Failed to add entry:", data.error);
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
              label="Programme"
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
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Course</InputLabel>
              <Select
                name="course"
                value={newEvent.course}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, course: e.target.value })
                }
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
            <Button
              onClick={clearTimetable}
              variant="outlined"
              color="error"
              sx={{ mt: 2 }}
            >
              Clear Timetable
            </Button>
            <Box mt={2}>
              <Button variant="contained" fullWidth onClick={handleSubmitEvent}>
                Add Event
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Right Side: Timetable Display using CalendarWidget */}
        <Grid item xs={9}>
          <Typography variant="h4" align="center" gutterBottom>
            Weekly Timetable
          </Typography>
          <CalendarWidget events={filteredEvents} refresh={refresh} />
        </Grid>
      </Grid>
    </Container>
  );
}
