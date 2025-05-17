// src/app/dashboard/LeftSidebar.js
import React from "react";
import { Card, CardHeader, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography, Box } from "@mui/material";
import { Timer as TimerIcon, Event } from "@mui/icons-material";
import RewardsPanel from "./RewardsPanel"; // Import the rewards panel

const pastelColors = ["#ffe4ec", "#e6f0ff", "#e6ffe6", "#f5e6ff", "#fffbe6"];

export default function LeftSidebar({ router }) {
  const flashcards = [
    { label: "Math Definitions", route: "/flashcards/math" },
    { label: "History Dates", route: "/flashcards/history" },
    { label: "Biology Terms", route: "/flashcards/biology" },
  ];
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
        <List dense>
          {flashcards.map((f, i) => (
            <ListItem key={i} disablePadding>
              <ListItemButton
                onClick={() => router.push(f.route)}
                sx={{
                  borderLeft: `6px solid ${pastelColors[i % pastelColors.length]}`,
                  borderRadius: 2,
                  mb: 1,
                  "&:hover": { bgcolor: pastelColors[i % pastelColors.length] + "22" }
                }}
              >
                <ListItemIcon>
                  <Event sx={{ color: pastelColors[i % pastelColors.length] }} />
                </ListItemIcon>
                <ListItemText primary={f.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
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
      {/* Replace Announcements with Rewards */}
      <RewardsPanel />
    </>
  );
}
