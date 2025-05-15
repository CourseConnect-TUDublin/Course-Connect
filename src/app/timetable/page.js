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

// Simple Navbar
function Navbar() {
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 3 }}>
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }}>TU Dublin – Timetable</Typography>
        <Link href="/dashboard" passHref legacyBehavior>
          <Button>Home</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default function TimetablePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [timetable, setTimetable] = useState([]);
  const [programmeData, setProgrammeData] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

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

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) signIn();
  }, [session, status]);

  // Load programme list
  useEffect(() => {
    if (!session) return;
    fetch("/api/programmeData")
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setProgrammeData(data.data);
          if (data.data.length) {
            const prog = data.data[0];
            setSelectedProgramme(prog.name);
            setNewEvent(ev => ({
              ...ev,
              programme: prog.name,
              course: prog.courses[0] || "",
            }));
          }
        }
      });
  }, [session]);

  // Fetch timetable for current user
  const fetchTimetable = useCallback(async () => {
    if (!session) return;
    const userId = session.user.id;
    const res = await fetch(`/api/timetable?userId=${userId}`);
    const data = await res.json();
    if (data.success) setTimetable(data.data || []);
    else toast.error("Failed to load timetable");
  }, [session]);

  useEffect(() => {
    if (session) fetchTimetable();
  }, [session, fetchTimetable, selectedProgramme, refreshKey]);

  // Filter by programme
  const filtered = timetable.filter(e => e.programme === selectedProgramme);

  // Handle form changes
  const onChange = e =>
    setNewEvent(ev => ({ ...ev, [e.target.name]: e.target.value }));
  const onDate = d => setNewEvent(ev => ({ ...ev, date: d }));
  const onTime = t => setNewEvent(ev => ({ ...ev, time: t }));
  const onRecurring = e =>
    setNewEvent(ev => ({ ...ev, recurring: e.target.checked }));

  // Submit new class
  const submit = async () => {
    const { course, lecturer, room, group, date, time } = newEvent;
    if (!course || !lecturer || !room || !group || !date || !time) {
      return toast.error("Please fill all fields");
    }
    const dt = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    ).toISOString();

    const payload = {
      ...newEvent,
      fullDateTime: dt,
      userId: session.user.id,
    };

    const res = await fetch("/api/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Class added");
      fetchTimetable();
      setNewEvent(ev => ({
        ...ev,
        lecturer: "",
        date: null,
        time: null,
        group: "",
        room: "",
        recurring: false,
      }));
      setRefreshKey(k => k + 1);
    } else {
      toast.error("Failed to add: " + data.error);
    }
  };

  if (status === "loading" || !session) {
    return <Typography>Loading…</Typography>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container maxWidth="xl">
        <Navbar />
        <Grid container spacing={4}>
          {/* Left: Form */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Select Programme</Typography>
              <FormControl fullWidth sx={{ my: 2 }}>
                <InputLabel>Programme</InputLabel>
                <Select
                  value={selectedProgramme}
                  onChange={e => {
                    setSelectedProgramme(e.target.value);
                    const p = programmeData.find(x => x.name === e.target.value);
                    setNewEvent(ev => ({
                      ...ev,
                      programme: e.target.value,
                      course: p?.courses?.[0] || "",
                    }));
                  }}
                  label="Programme"
                >
                  {programmeData.map(p => (
                    <MenuItem key={p.name} value={p.name}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="h6">Add Class</Typography>
              <FormControl fullWidth sx={{ my: 1 }}>
                <InputLabel>Course</InputLabel>
                <Select
                  name="course"
                  value={newEvent.course}
                  onChange={onChange}
                  label="Course"
                >
                  {(programmeData.find(p => p.name === selectedProgramme)
                    ?.courses || []
                  ).map(c => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Lecturer"
                name="lecturer"
                fullWidth
                sx={{ my: 1 }}
                value={newEvent.lecturer}
                onChange={onChange}
              />
              <TextField
                label="Room"
                name="room"
                fullWidth
                sx={{ my: 1 }}
                value={newEvent.room}
                onChange={onChange}
              />
              <TextField
                label="Group"
                name="group"
                fullWidth
                sx={{ my: 1 }}
                value={newEvent.group}
                onChange={onChange}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={newEvent.date}
                  onChange={onDate}
                  renderInput={params => (
                    <TextField {...params} fullWidth sx={{ my: 1 }} />
                  )}
                />
                <TimePicker
                  label="Time"
                  value={newEvent.time}
                  onChange={onTime}
                  renderInput={params => (
                    <TextField {...params} fullWidth sx={{ my: 1 }} />
                  )}
                />
              </LocalizationProvider>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newEvent.recurring}
                    onChange={onRecurring}
                  />
                }
                label="Recurring Weekly"
              />
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button variant="outlined" onClick={() => setTimetable([])}>
                  Clear
                </Button>
                <Button variant="contained" onClick={submit}>
                  Add Class
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Right: Calendar */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" align="center" gutterBottom>
                Weekly Timetable
              </Typography>
              <CalendarWidget
                events={filtered}
                refresh={refreshKey}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
}
