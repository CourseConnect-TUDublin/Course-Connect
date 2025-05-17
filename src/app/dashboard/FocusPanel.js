// src/app/dashboard/FocusPanel.js
import React, { useState, useEffect } from "react";
import { Card, CardHeader, Divider, CardContent, Typography, Button, CircularProgress, TextField, Grid } from "@mui/material";
import { Timer as TimerIcon, BarChart, Note } from "@mui/icons-material";

const FOCUS_DURATION = 25 * 60;

export default function FocusPanel({ router }) {
  const [focusTime, setFocusTime] = useState(FOCUS_DURATION);
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState("");
  useEffect(() => {
    const saved = localStorage.getItem("quickNote");
    if (saved) setNote(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("quickNote", note);
  }, [note]);
  useEffect(() => {
    let timer;
    if (running && focusTime > 0) {
      timer = setTimeout(() => setFocusTime((t) => t - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [running, focusTime]);
  const mins = String(Math.floor(focusTime / 60)).padStart(2, "0");
  const secs = String(focusTime % 60).padStart(2, "0");

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <Card>
          <CardHeader avatar={<TimerIcon />} title="Focus Timer" />
          <Divider />
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h3">
              {mins}:{secs}
            </Typography>
            <Button variant="contained" size="small" onClick={() => setRunning((r) => !r)} sx={{ mt: 1 }}>
              {running ? "Pause" : "Start"}
            </Button>
            <Button
              size="small"
              onClick={() => {
                setRunning(false);
                setFocusTime(FOCUS_DURATION);
                router.push("/study-session/log");
              }}
            >
              End
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Card>
          <CardHeader avatar={<BarChart />} title="Study Progress" />
          <CardContent sx={{ textAlign: "center" }}>
            <CircularProgress variant="determinate" value={65} size={60} />
            <Typography variant="caption" display="block" mt={1}>65% Goal</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Card>
          <CardHeader avatar={<Note />} title="Quick Note" />
          <Divider />
          <CardContent>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Jot something…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
