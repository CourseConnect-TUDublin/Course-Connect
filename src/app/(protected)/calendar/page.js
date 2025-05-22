"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Container, Typography, CssBaseline, Box } from "@mui/material";
import CalendarWidget from "../../../components/CalendarWidget";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export default function CalendarPage() {
  const { data: session } = useSession();
  const [timetable, setTimetable] = useState([]);

  // Fetch tasks from your timetable API using the userId from session.
  const fetchTimetable = useCallback(async () => {
    if (!session) return;
    const userId = session.user.id || session.user.sub;
    const url = `/api/timetable?userId=${userId}`;
    console.log("Fetching timetable from:", url);
    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setTimetable(data.data || []);
      } else {
        toast.error("Failed to fetch timetable data: " + data.error);
      }
    } catch (error) {
      console.error("Error fetching timetable:", error);
      toast.error("Error fetching timetable data");
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchTimetable();
    }
  }, [session, fetchTimetable]);

  // For consistency, we simply pass all tasks (that have a date) to the CalendarWidget.
  const events = Array.isArray(timetable)
    ? timetable.filter((entry) => entry.fullDateTime || entry.dueDate)
    : [];

  console.log("Calendar events:", events);

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
          Calendar
        </Typography>
        <Box>
          <CalendarWidget events={events} refresh={Date.now()} />
        </Box>
      </Container>
    </motion.div>
  );
}