"use client";

import React, { useState, useEffect } from "react";
import { Container, Grid, Paper, Typography, Box, CssBaseline } from "@mui/material";
import { motion } from "framer-motion";
import ArchiveIcon from "@mui/icons-material/Archive";

function ArchivedTaskCard({ task }) {
  let borderColor, bgColor;
  switch (task.status) {
    case "red":
      borderColor = "#e53935";
      bgColor = "#ffebee";
      break;
    case "amber":
      borderColor = "#fb8c00";
      bgColor = "#fff3e0";
      break;
    case "green":
      borderColor = "#43a047";
      bgColor = "#e8f5e9";
      break;
    default:
      borderColor = "#cccccc";
      bgColor = "#ffffff";
  }
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        borderLeft: `5px solid ${borderColor}`,
        backgroundColor: bgColor,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {task.title}
        </Typography>
        <ArchiveIcon />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {task.description}
      </Typography>
      {task.dueDate && (
        <Typography variant="caption" color="text.secondary">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </Typography>
      )}
    </Paper>
  );
}

export default function ArchivePage() {
  const [archivedTasks, setArchivedTasks] = useState([]);

  const fetchArchivedTasks = async () => {
    try {
      const res = await fetch("/api/tasks?archived=true");
      const data = await res.json();
      if (data.success) {
        setArchivedTasks(data.data);
      } else {
        console.error("Failed to fetch archived tasks:", data.error);
      }
    } catch (error) {
      console.error("Error fetching archived tasks:", error);
    }
  };

  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Archived Tasks
        </Typography>
        {archivedTasks.length === 0 ? (
          <Typography>No archived tasks.</Typography>
        ) : (
          <Grid container spacing={3}>
            {archivedTasks.map((task) => (
              <Grid item xs={12} md={4} key={task._id}>
                <ArchivedTaskCard task={task} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </motion.div>
  );
}
