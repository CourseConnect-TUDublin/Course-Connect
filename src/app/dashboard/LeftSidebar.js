// src/app/dashboard/LeftSidebar.js
import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, Divider, Paper, Typography, Box
} from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";
import RewardsPanel from "./RewardsPanel";
import FlashcardPreview from "./FlashcardPreview";

export default function LeftSidebar({ router }) {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlashcards() {
      setLoading(true);
      try {
        const res = await fetch("/api/flashcards");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setFlashcards(data.data);
        } else {
          setFlashcards([]);
        }
      } catch {
        setFlashcards([]);
      }
      setLoading(false);
    }
    fetchFlashcards();
  }, []);

  const quickActions = [
    { label: "Timetable", route: "/timetable" },
    { label: "Assignments", route: "/assignments" },
    { label: "Task Manager", route: "/TaskManager" },
    { label: "To-Do", route: "/todo" },
  ];

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardHeader avatar={<TimerIcon />} title="Flashcards" />
        <Divider />
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Typography variant="body2" color="text.secondary">
              Loading flashcards…
            </Typography>
          ) : (
            <FlashcardPreview cards={flashcards} />
          )}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: "#1976d2",
                fontWeight: 500,
                cursor: "pointer",
                textDecoration: "underline",
                "&:hover": { opacity: 0.7 },
              }}
              onClick={() => router.push("/flashcards")}
            >
              See all flashcards
            </Typography>
          </Box>
        </Box>
      </Card>
      <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "#f4f6fa", mb: 2 }}>
        <Typography variant="h6" gutterBottom>Quick Actions</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {quickActions.map((act, idx) => (
            <button
              key={act.route}
              style={{
                minWidth: 100,
                borderRadius: 12,
                fontWeight: 600,
                padding: "6px 18px",
                background: idx % 2 === 0 ? "#1976d2" : "#fff",
                color: idx % 2 === 0 ? "#fff" : "#1976d2",
                border: `2px solid #1976d2`,
                cursor: "pointer"
              }}
              onClick={() => router.push(act.route)}
            >
              {act.label}
            </button>
          ))}
        </Box>
      </Paper>
      <RewardsPanel />
    </>
  );
}
