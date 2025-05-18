// src/app/dashboard/TimetablePreview.js
import React from "react";
import { Box, Grid, Typography, Paper, Button } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";

const pastelColors = ["#ffe4ec", "#e6f0ff", "#e6ffe6", "#f5e6ff", "#fffbe6"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function getColorForEvent(course) {
  if (!course) return pastelColors[0];
  let idx = [...course].reduce((acc, c) => acc + c.charCodeAt(0), 0) % pastelColors.length;
  return pastelColors[idx];
}
function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function getWeekRange(baseDate = new Date()) {
  const monday = new Date(baseDate);
  monday.setDate(monday.getDate() - monday.getDay() + 1);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}
function groupEventsByDay(events) {
  const { monday, sunday } = getWeekRange();
  const map = {};
  days.forEach((day) => { map[day] = []; });
  events.forEach((e) => {
    const eventDate = new Date(e.fullDateTime);
    if (eventDate < monday || eventDate > sunday) return;
    const weekday = eventDate.toLocaleString("en-IE", { weekday: "long" });
    if (map[weekday]) map[weekday].push(e);
  });
  for (const day of days) {
    map[day].sort((a, b) => new Date(a.fullDateTime) - new Date(b.fullDateTime));
  }
  return map;
}

export default function TimetablePreview({ events, onOpenTimetable }) {
  const grouped = groupEventsByDay(events || []);
  return (
    <Box>
      <Grid container spacing={1}>
        {days.map((day) => (
          <Grid item xs={12} key={day}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>{day}</Typography>
            <Paper
              variant="outlined"
              sx={{ minHeight: 50, bgcolor: "#fcfcfc", p: 1.5, borderRadius: 2, boxShadow: "none", mb: 1 }}
            >
              {grouped[day].length === 0 ? (
                <Box sx={{ textAlign: "center", color: "#aaa", py: 1.5, opacity: 0.8 }}>
                  <CalendarMonth sx={{ fontSize: 24, mb: 0.5 }} />
                  <Typography sx={{ fontSize: 13 }}>No classes scheduled</Typography>
                </Box>
              ) : (
                grouped[day].map((event) => (
                  <Box
                    key={event._id}
                    sx={{
                      mb: 1,
                      p: 1,
                      borderRadius: 2,
                      bgcolor: getColorForEvent(event.course),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow: "0 2px 8px #0001",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 15 }}>{event.course}</Typography>
                      <Typography sx={{ fontSize: 13 }}>{formatTime(event.fullDateTime)} | {event.room}</Typography>
                      <Typography variant="caption" color="text.secondary">{event.lecturer}</Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={onOpenTimetable}>
        View Full Timetable
      </Button>
    </Box>
  );
}
