"use client";
import React, { useEffect, useState } from "react";
import {
  Container, Typography, Grid, Box, Paper, Button, Fab,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Checkbox, FormControlLabel, Stack,
} from "@mui/material";
import { CalendarMonth, Add as AddIcon } from "@mui/icons-material";
import { useSession } from "next-auth/react";

// Helper for nice pastel event backgrounds
const pastelColors = ["#ffe4ec", "#e6f0ff", "#e6ffe6", "#f5e6ff", "#fffbe6"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const slotTimes = [
  { start: 9, end: 11 }, { start: 11, end: 13 }, { start: 13, end: 15 },
  { start: 15, end: 17 }, { start: 17, end: 19 }, { start: 19, end: 21 }, { start: 21, end: 23 }
];

// Utilities for week range and display
function getWeekRange(baseDate = new Date()) {
  const monday = new Date(baseDate); monday.setDate(monday.getDate() - monday.getDay() + 1); monday.setHours(0,0,0,0);
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6); sunday.setHours(23,59,59,999);
  return { monday, sunday };
}
function addWeeks(date, n) { const d = new Date(date); d.setDate(d.getDate() + n * 7); return d; }
function formatWeek(monday, sunday) {
  return `${monday.toLocaleDateString("en-IE", { month: "short", day: "numeric" })} – ${sunday.toLocaleDateString("en-IE", { month: "short", day: "numeric", year: "numeric" })}`;
}
function formatSlotLabel(start, end) {
  const f = h => `${h % 12 || 12}${h < 12 ? "am" : "pm"}`;
  return `${f(start)} – ${f(end)}`;
}
function getColor(course) {
  if (!course) return pastelColors[0];
  let idx = [...course].reduce((a, c) => a + c.charCodeAt(0), 0) % pastelColors.length;
  return pastelColors[idx];
}

export default function TimetableWeekView() {
  const { data: session } = useSession();
  const [timetable, setTimetable] = useState([]);
  const [programmeList, setProgrammeList] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Form state for the add-class dialog
  const [form, setForm] = useState({
    programme: "",
    course: "",
    room: "",
    group: "",
    lecturer: "",
    date: "",
    time: "",
    recurring: false,
  });

  // Which week is being displayed
  const [currentWeekMonday, setCurrentWeekMonday] = useState(() => getWeekRange().monday);

  // Fetch programmes from DB for dropdown
  useEffect(() => {
    fetch("/api/programmeData")
      .then(res => res.json())
      .then(json => {
        setProgrammeList(json.data || []);
        setForm(f => ({
          ...f,
          programme: json.data?.[0]?.name || "",
          course: ""
        }));
      });
  }, []);

  // Fetch timetable from DB
  useEffect(() => {
    if (!session) return;
    fetch("/api/timetable")
      .then(res => res.json())
      .then(data => setTimetable(data.data || []));
  }, [session, refreshKey]);

  // Add class handler
  const handleAddEvent = async () => {
    const { programme, course, room, group, lecturer, date, time, recurring } = form;
    if (!course || !date || !time || !room || !group || !lecturer) return;
    const [year, month, day] = date.split("-");
    const [startHour] = time.split(":");
    const dt = new Date(year, month - 1, day, startHour, 0).toISOString();
    await fetch("/api/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programme, course, room, group, lecturer, fullDateTime: dt, recurring }),
    });
    setShowAdd(false);
    setForm(f => ({ ...f, course: "", room: "", group: "", lecturer: "", date: "", time: "", recurring: false }));
    setRefreshKey(k => k + 1);
  };

  // Delete class
  const handleDeleteEvent = async id => {
    await fetch(`/api/timetable/${id}`, { method: "DELETE" });
    setRefreshKey(k => k + 1);
  };

  // Group timetable entries for the current week by day
  function groupEventsByDay(events) {
    const { monday, sunday } = getWeekRange(currentWeekMonday);
    const map = {}; days.forEach(day => { map[day] = []; });
    events.forEach(e => {
      const d = new Date(e.fullDateTime);
      if (d >= monday && d <= sunday) {
        const weekday = d.toLocaleString("en-IE", { weekday: "long" });
        if (map[weekday]) map[weekday].push(e);
      }
    });
    for (const day of days) map[day].sort((a, b) => new Date(a.fullDateTime) - new Date(b.fullDateTime));
    return map;
  }
  const groupedEvents = groupEventsByDay(timetable);

  // Courses for currently selected programme
  const currentProg = programmeList.find(p => p.name === form.programme);
  const courseOptions = currentProg?.courses || [];

  // UI
  const { monday, sunday } = getWeekRange(currentWeekMonday);
  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Weekly Schedule</Typography>
        <Stack direction="row" spacing={1}>
          <Button onClick={() => setCurrentWeekMonday(addWeeks(currentWeekMonday, -1))}>Previous</Button>
          <Button onClick={() => setCurrentWeekMonday(addWeeks(currentWeekMonday, 1))}>Next</Button>
        </Stack>
      </Stack>
      <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>{formatWeek(monday, sunday)}</Typography>
      <Grid container spacing={2}>
        {days.map(day => (
          <Grid item xs={12} key={day}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>{day}</Typography>
            <Paper variant="outlined" sx={{ minHeight: 90, bgcolor: "#fcfcfc", p: 2, mb: 1 }}>
              {groupedEvents[day].length === 0 ? (
                <Box sx={{ textAlign: "center", color: "#aaa", py: 4, opacity: 0.8 }}>
                  <CalendarMonth sx={{ fontSize: 36, mb: 1 }} />
                  <Typography>No classes</Typography>
                </Box>
              ) : (
                groupedEvents[day].map(ev => (
                  <Box key={ev._id} sx={{
                    mb: 2, p: 2, borderRadius: 2, bgcolor: getColor(ev.course),
                    display: "flex", alignItems: "center", justifyContent: "space-between"
                  }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{ev.course}</Typography>
                      <Typography sx={{ fontSize: 15 }}>
                        {slotTimes.find(s => new Date(ev.fullDateTime).getHours() === s.start)
                          ? formatSlotLabel(slotTimes.find(s => new Date(ev.fullDateTime).getHours() === s.start).start,
                              slotTimes.find(s => new Date(ev.fullDateTime).getHours() === s.start).end)
                          : new Date(ev.fullDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {" | "}Room: {ev.room} | Group: {ev.group}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{ev.lecturer}</Typography>
                    </Box>
                    <Button size="small" color="error" sx={{ minWidth: 32, fontWeight: 700, fontSize: 20 }}
                      onClick={() => handleDeleteEvent(ev._id)}>×</Button>
                  </Box>
                ))
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* Add Class Button */}
      <Box sx={{ position: "fixed", right: 32, bottom: 32, zIndex: 120 }}>
        <Fab color="primary" aria-label="add" onClick={() => setShowAdd(true)}>
          <AddIcon />
        </Fab>
      </Box>
      {/* Add Class Dialog */}
      <Dialog open={showAdd} onClose={() => setShowAdd(false)}>
        <DialogTitle>Add Class</DialogTitle>
        <DialogContent sx={{ minWidth: 340 }}>
          <TextField
            label="Programme" select fullWidth sx={{ my: 1 }} value={form.programme}
            onChange={e => setForm(f => ({ ...f, programme: e.target.value, course: "" }))}
          >
            {programmeList.length === 0 ? <MenuItem value="">No programmes</MenuItem>
              : programmeList.map(prog =>
                <MenuItem key={prog._id} value={prog.name}>{prog.name}</MenuItem>
              )}
          </TextField>
          <TextField
            label="Course" select fullWidth sx={{ my: 1 }} value={form.course}
            onChange={e => setForm(f => ({ ...f, course: e.target.value }))}
          >
            {courseOptions.length === 0
              ? <MenuItem value="">No courses</MenuItem>
              : courseOptions.map(course =>
                <MenuItem key={course} value={course}>{course}</MenuItem>
              )}
          </TextField>
          <TextField label="Room" fullWidth sx={{ my: 1 }} value={form.room}
            onChange={e => setForm(f => ({ ...f, room: e.target.value }))} />
          <TextField label="Group" fullWidth sx={{ my: 1 }} value={form.group}
            onChange={e => setForm(f => ({ ...f, group: e.target.value }))} />
          <TextField label="Lecturer" fullWidth sx={{ my: 1 }} value={form.lecturer}
            onChange={e => setForm(f => ({ ...f, lecturer: e.target.value }))} />
          <TextField label="Date" type="date" fullWidth sx={{ my: 1 }} InputLabelProps={{ shrink: true }}
            value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <TextField
            label="Time Slot" select fullWidth sx={{ my: 1 }} value={form.time}
            onChange={e => setForm(f => ({ ...f, time: e.target.value }))} InputLabelProps={{ shrink: true }}
          >
            {slotTimes.map(({ start, end }) => (
              <MenuItem key={start} value={String(start).padStart(2, "0") + ":00"}>
                {formatSlotLabel(start, end)}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox checked={form.recurring}
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
