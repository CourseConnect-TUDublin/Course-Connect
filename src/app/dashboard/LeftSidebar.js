import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import RewardsPanel from "./RewardsPanel";
import FlashcardPreview from "./FlashcardPreview"; // <-- Add this import

export default function LeftSidebar({ router }) {
  const quickActions = [
    { label: "Timetable", route: "/timetable" },
    { label: "Assignments", route: "/assignments" },
    { label: "Task Manager", route: "/TaskManager" },
    { label: "To-Do", route: "/todo" },
  ];

  return (
    <>
      <FlashcardPreview />

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
