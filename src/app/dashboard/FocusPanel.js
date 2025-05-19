"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Divider,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  LinearProgress,
  Box
} from "@mui/material";
import { Timer as TimerIcon, Note, EmojiEvents } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

// XP LEVEL LOGIC
function getLevelFromXP(xp) {
  let level = 1;
  let xpRequired = 100;

  while (xp >= xpRequired) {
    xp -= xpRequired;
    level++;
    xpRequired = 100 + (level - 1) * 50;
  }

  return {
    level,
    xpToNext: xpRequired,
    xpIntoLevel: xp,
    percent: Math.floor((xp / xpRequired) * 100),
  };
}

const FOCUS_DURATION = 25 * 60;
const FOCUS_XP_REWARD = 10;

export default function FocusPanel({ router }) {
  const { data: session } = useSession();
  const user = session?.user;

  const [focusTime, setFocusTime] = useState(FOCUS_DURATION);
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState("");

  // Load saved quick note
  useEffect(() => {
    const saved = localStorage.getItem("quickNote");
    if (saved) setNote(saved);
  }, []);

  // Save note on change
  useEffect(() => {
    localStorage.setItem("quickNote", note);
  }, [note]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (running && focusTime > 0) {
      timer = setTimeout(() => setFocusTime((t) => t - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [running, focusTime]);

  const mins = String(Math.floor(focusTime / 60)).padStart(2, "0");
  const secs = String(focusTime % 60).padStart(2, "0");

  // XP & Level logic
  const xp = user?.xp ?? 0;
  const { level, xpToNext, xpIntoLevel, percent } = getLevelFromXP(xp);

  // 🧠 Handle Focus End → award XP
  const handleEndSession = async () => {
    setRunning(false);
    setFocusTime(FOCUS_DURATION);

    try {
      const res = await fetch("/api/xp/gain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: FOCUS_XP_REWARD }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`+${FOCUS_XP_REWARD} XP earned!`);
        router.push("/study-session/log");
      } else {
        toast.error("Failed to award XP");
      }
    } catch (err) {
      console.error("XP update failed:", err);
      toast.error("An error occurred while awarding XP");
    }
  };

  return (
    <Grid container direction="column" spacing={3}>
      {/* Focus Timer */}
      <Grid item>
        <Card>
          <CardHeader avatar={<TimerIcon />} title="Focus Timer" />
          <Divider />
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h3">
              {mins}:{secs}
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => setRunning((r) => !r)}
              sx={{ mt: 1 }}
            >
              {running ? "Pause" : "Start"}
            </Button>
            <Button size="small" onClick={handleEndSession}>
              End
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* XP & Level Summary Widget */}
      <Grid item>
        <Card>
          <CardHeader avatar={<EmojiEvents />} title="XP & Level Summary" />
          <Divider />
          <CardContent>
            <Typography variant="body1">
              Level: <strong>{level}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              XP: {xpIntoLevel} / {xpToNext}
            </Typography>
            <Box mt={1}>
              <LinearProgress variant="determinate" value={percent} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Note */}
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
