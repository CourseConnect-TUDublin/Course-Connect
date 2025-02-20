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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from "@mui/material";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Import Date & Time Pickers
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Import CalendarWidget component
import CalendarWidget from "../../components/CalendarWidget";

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

  const [newEvent, setNewEvent] = useState({
    programme: "",
    course: "",
    lecturer: "",
    date: null,
    time: null,
    group: "",
    room: ""
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      console.log("No session found, calling signIn()");
      signIn(); // Trigger NextAuth signIn to refresh the session
    }
  }, [session, status]);

  // Fetch programme data (only if user is logged in)
  useEffect(() => {
    if (!session) return;
    fetchProgrammeData();
  }, [session]);

  // Fetch timetable when selectedProgramme or session changes
  useEffect(() => {
    if (!session) return;
    fetchTimetable();
  }, [selectedProgramme, session]);

  const fetchTimetable = async () => {
    try {
      const res = await fetch("/api/timetable", {
        method: "GET",
        credentials: "include", // Ensure cookies are sent
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        console.log("Timetable fetch success:", data.data);
        setTimetable(data.data);
      } else {
        console.error("❌ Error fetching timetable:", data.error);
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
    }
  };

  const fetchProgrammeData = async () => {
    try {
      const res = await fetch("/api/programmeData");
      const data = await res.json();
      if (data.success) {
        console.log("Fetched programmes:", data.data);
        setProgrammeData(data.data);
        if (data.data.length > 0) {
          const initialProgramme = data.data[0];
          setSelectedProgramme(initialProgramme.name);
          setNewEvent((prev) => ({
            ...prev,
            programme: initialProgramme.name,
            course: (initialProgramme.courses && initialProgramme.courses[0]) || ""
          }));
        }
      } else {
        console.error("Error loading programme data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching programme data:", error);
    }
  };

  const handleProgrammeChange = (e) => {
    const programmeName = e.target.value;
    setSelectedProgramme(programmeName);
    const currentProgramme = programmeData.find((prog) => prog.name === programmeName);
    setNewEvent((prev) => ({
      ...prev,
      programme: programmeName,
      course: currentProgramme?.courses?.length > 0 ? currentProgramme.courses[0] : ""
    }));
    setRefresh(Date.now());
  };

  const handleNewEventChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleSubmitEvent = async () => {
    if (!session || !session.user?.id) {
      alert("Error: User not logged in.");
      return;
    }
    if (!newEvent.course || !newEvent.lecturer || !newEvent.room || !newEvent.date || !newEvent.time || !newEvent.group) {
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
      fullDateTime: combinedDateTime
    };
    console.log("Adding New Entry:", eventToSubmit);

    try {
      const res = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure cookies are sent
        body: JSON.stringify(eventToSubmit)
      });
      const data = await res.json();
      if (data.success) {
        console.log("Entry added successfully:", data.entry);
        // Reset fields except course (keep course selection)
        setNewEvent((prev) => ({
          ...prev,
          lecturer: "",
          room: "",
          date: null,
          time: null,
          group: ""
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
    return <Typography sx={{ textAlign: "center", p: 4 }}>Loading...</Typography>;
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
            <Select value={selectedProgramme} onChange={handleProgrammeChange} label="Programme">
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
                value={newEvent.course}
                onChange={(e) => setNewEvent({ ...newEvent, course: e.target.value })}
                label="Course"
                name="course"
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
              value={newEvent.lecturer}
              onChange={handleNewEventChange}
            />
            <TextField
              margin="dense"
              name="room"
              label="Room Number"
              fullWidth
              value={newEvent.room}
              onChange={handleNewEventChange}
            />
            <TextField
              margin="dense"
              name="group"
              label="Group"
              fullWidth
              value={newEvent.group}
              onChange={handleNewEventChange}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={newEvent.date}
                onChange={(val) => setNewEvent({ ...newEvent, date: val })}
                renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
              />
              <TimePicker
                label="Select Time"
                value={newEvent.time}
                onChange={(val) => setNewEvent({ ...newEvent, time: val })}
                renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
              />
            </LocalizationProvider>
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmitEvent}>
              Add Schedule
            </Button>
          </Box>
        </Grid>

        {/* Right Side: Timetable Display using CalendarWidget */}
        <Grid item xs={9}>
          <Typography variant="h4" align="center" gutterBottom>
            Weekly Timetable
          </Typography>
          <CalendarWidget events={timetable} refresh={refresh} />
        </Grid>
      </Grid>
    </Container>
  );
}
