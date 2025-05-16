"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Button,
  Fab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { CalendarMonth, Add as AddIcon } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

// Pastel colors for cards
const pastelColors = [
  "#ffe4ec", "#e6f0ff", "#e6ffe6", "#f5e6ff", "#fffbe6",
];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// ---- 2-hour slots: 9am-11am ... 9pm-11pm ----
const slotTimes = [
  { start: 9, end: 11 },
  { start: 11, end: 13 },
  { start: 13, end: 15 },
  { start: 15, end: 17 },
  { start: 17, end: 19 },
  { start: 19, end: 21 },
  { start: 21, end: 23 }
];

function formatSlotLabel(startHour, endHour) {
  const format = h => {
    let hour = h % 12 || 12;
    let ampm = h < 12 ? "am" : "pm";
    return `${hour}${ampm}`;
  };
  return `${format(startHour)} – ${format(endHour)}`;
}

function getWeekRange(baseDate = new Date()) {
  const monday = new Date(baseDate);
  monday.setDate(monday.getDate() - monday.getDay() + 1);
  monday.setHours(0,0,0,0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23,59,59,999);

  return { monday, sunday };
}
function addWeeks(date, num) {
  const d = new Date(date);
  d.setDate(d.getDate() + num * 7);
  return d;
}
function formatWeek(monday, sunday) {
  return (
    monday.toLocaleDateString("en-IE", { month: "short", day: "numeric" }) +
    " – " +
    sunday.toLocaleDateString("en-IE", { month: "short", day: "numeric", year: "numeric" })
  );
}
function getColorForEvent(course) {
  if (!course) return pastelColors[0];
  let idx = [...course].reduce((acc, c) => acc + c.charCodeAt(0), 0) % pastelColors.length;
  return pastelColors[idx];
}
function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function TimetableWeekView() {
  const { data: session, status } = useSession();
  const [timetable, setTimetable] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Week selection state
  const [currentWeekMonday, setCurrentWeekMonday] = useState(() => {
    const { monday } = getWeekRange();
    return monday;
  });

  // Add class modal
  const [showAdd, setShowAdd] = useState(false);
  const programmeList = [
    "BSc Computing",
    "BA Business",
    "BEng Engineering",
    "BSc Science",
  ];
  const [form, setForm] = useState({
    programme: programmeList[0],
    course: "",
    room: "",
    group: "",
    lecturer: "",
    date: "",
    time: "",
    recurring: false,
  });

  // --- FETCH LOGIC ---
  const fetchTimetable = useCallback(async () => {
    if (!session) return;
    const res = await fetch("/api/timetable");
    const data = await res.json();
    if (data.success) setTimetable(data.data || []);
    else toast.error("Failed to load timetable");
  }, [session]);
  useEffect(() => {
    if (session) fetchTimetable();
  }, [session, fetchTimetable, refreshKey]);

  // --- DELETE LOGIC ---
  const handleDeleteEvent = async (eventId) => {
    const res = await fetch(`/api/timetable/${eventId}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Class removed");
      setRefreshKey((k) => k + 1);
    } else {
      toast.error("Failed to remove class");
    }
  };

  // --- ADD LOGIC (ALWAYS 2-HOUR SLOT) ---
  const handleAddEvent = async () => {
    if (!form.course || !form.date || !form.time || !form.room || !form.group || !form.lecturer) {
      toast.error("Please fill all fields");
      return;
    }
    const [year, month, day] = form.date.split("-");
    const [startHour] = form.time.split(":");
    const dt = new Date(year, month - 1, day, startHour, 0).toISOString();

    const payload = {
      programme: form.programme,
      course: form.course,
      lecturer: form.lecturer,
      room: form.room,
      group: form.group,
      fullDateTime: dt,
      recurring: form.recurring,
    };
    const res = await fetch("/api/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Class added");
      setShowAdd(false);
      setForm({
        programme: programmeList[0],
        course: "",
        room: "",
        group: "",
        lecturer: "",
        date: "",
        time: "",
        recurring: false,
      });
      setRefreshKey((k) => k + 1);
    } else {
      toast.error("Failed to add class");
    }
  };

  // --- Filter and group events for selected week only ---
  function groupEventsByDay(events) {
    const { monday, sunday } = getWeekRange(currentWeekMonday);
    const map = {};
    days.forEach((day) => { map[day] = []; });
    events.forEach((e) => {
      const eventDate = new Date(e.fullDateTime);
      if (eventDate < monday || eventDate > sunday) return; // only events in this week
      const weekday = eventDate.toLocaleString("en-IE", { weekday: "long" });
      if (map[weekday]) map[weekday].push(e);
    });
    for (const day of days) {
      map[day].sort((a, b) => new Date(a.fullDateTime) - new Date(b.fullDateTime));
    }
    return map;
  }
  const { monday, sunday } = getWeekRange(currentWeekMonday);
  const groupedEvents = groupEventsByDay(timetable);

  if (status === "loading" || !session) {
    return <Typography>Loading…</Typography>;
  }

  return (
    <Container maxWidth="xl" sx={{ pb: 8 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Weekly Schedule
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button onClick={() => setCurrentWeekMonday(addWeeks(currentWeekMonday, -1))}>
            Previous Week
          </Button>
          <Button onClick={() => setCurrentWeekMonday(addWeeks(currentWeekMonday, 1))}>
            Next Week
          </Button>
        </Stack>
      </Stack>
      <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>
        {formatWeek(monday, sunday)}
      </Typography>
      <Grid container spacing={2}>
        {days.map((day) => (
          <Grid item xs={12} key={day}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              {day}
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                minHeight: 100,
                bgcolor: "#fcfcfc",
                p: 2,
                borderRadius: 2,
                boxShadow: "none",
                mb: 1,
              }}
            >
              {groupedEvents[day].length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    color: "#aaa",
                    py: 5,
                    opacity: 0.8,
                  }}
                >
                  <CalendarMonth sx={{ fontSize: 40, mb: 1 }} />
                  <Typography>No classes scheduled</Typography>
                  <Typography variant="caption">
                    Add a class to get started
                  </Typography>
                </Box>
              ) : (
                groupedEvents[day].map((event) => {
                  const eventDate = new Date(event.fullDateTime);
                  const slot = slotTimes.find(({ start }) => eventDate.getHours() === start);
                  return (
                    <Box
                      key={event._id}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: getColorForEvent(event.course),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 2px 8px #0001",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, mb: 0.5 }}
                        >
                          {event.course}
                        </Typography>
                        <Typography sx={{ fontSize: 15 }}>
                          {slot
                            ? formatSlotLabel(slot.start, slot.end)
                            : formatTime(event.fullDateTime) + " – 2hr"}
                          {" | "}Room: {event.room} | Group: {event.group}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.lecturer}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        color="error"
                        sx={{ minWidth: 32, fontWeight: 700, fontSize: 20 }}
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        ×
                      </Button>
                    </Box>
                  );
                })
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Floating action button (add class) */}
      <Box
        sx={{
          position: "fixed",
          right: 32,
          bottom: 32,
          zIndex: 120,
        }}
      >
        <Fab color="primary" aria-label="add" onClick={() => setShowAdd(true)}>
          <AddIcon />
        </Fab>
      </Box>

      {/* Add class modal (time is dropdown, 2-hour slots only) */}
      <Dialog open={showAdd} onClose={() => setShowAdd(false)}>
        <DialogTitle>Add Class</DialogTitle>
        <DialogContent sx={{ minWidth: 340 }}>
          <TextField
            label="Programme"
            select
            fullWidth
            sx={{ my: 1 }}
            value={form.programme}
            onChange={e => setForm(f => ({ ...f, programme: e.target.value }))}
          >
            {programmeList.map((prog) => (
              <MenuItem key={prog} value={prog}>{prog}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Course"
            fullWidth
            sx={{ my: 1 }}
            value={form.course}
            onChange={e => setForm(f => ({ ...f, course: e.target.value }))}
          />
          <TextField
            label="Room"
            fullWidth
            sx={{ my: 1 }}
            value={form.room}
            onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
          />
          <TextField
            label="Group"
            fullWidth
            sx={{ my: 1 }}
            value={form.group}
            onChange={e => setForm(f => ({ ...f, group: e.target.value }))}
          />
          <TextField
            label="Lecturer"
            fullWidth
            sx={{ my: 1 }}
            value={form.lecturer}
            onChange={e => setForm(f => ({ ...f, lecturer: e.target.value }))}
          />
          <TextField
            label="Date"
            type="date"
            fullWidth
            sx={{ my: 1 }}
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          />
          <TextField
            label="Time Slot"
            select
            fullWidth
            sx={{ my: 1 }}
            value={form.time}
            onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          >
            {slotTimes.map(({ start, end }) => (
              <MenuItem
                key={start}
                value={String(start).padStart(2, "0") + ":00"}
              >
                {formatSlotLabel(start, end)}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.recurring}
                onChange={e => setForm(f => ({ ...f, recurring: e.target.checked }))}
              />
            }
            label="Recurring Weekly"
            sx={{ my: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAdd(false)} color="inherit">Cancel</Button>
          <Button onClick={handleAddEvent} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
