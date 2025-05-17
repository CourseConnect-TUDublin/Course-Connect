"use client";
import React, { useCallback, useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import SummaryCards from "./SummaryCards";
import LeftSidebar from "./LeftSidebar";
import TimetablePreview from "./TimetablePreview";
import FocusPanel from "./FocusPanel";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CourseConnectDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [timetable, setTimetable] = useState([]);

  const fetchTimetable = useCallback(async () => {
    try {
      const res = await fetch(`/api/timetable`);
      const data = await res.json();
      if (data.success) setTimetable(data.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (status !== "loading" && !session) router.push("/login");
    fetchTimetable();
  }, [session, status, router, fetchTimetable]);

  const userName = session?.user?.email || "Guest";

  return (
    <DashboardLayout>
      <Box sx={{ px: { xs: 2, md: 4 }, py: 4, mt: 2, maxWidth: 1400, mx: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome, {userName}!
        </Typography>
        {/* SummaryCards now supports animated cards */}
        <SummaryCards router={router} />

        <Grid container spacing={3}>
          {/* Left: Flashcards, Quick Actions, Rewards (updated) */}
          <Grid item xs={12} md={4}><LeftSidebar router={router} /></Grid>
          {/* Center: Timetable */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Timetable
              </Typography>
              <TimetablePreview
                events={timetable}
                onOpenTimetable={() => router.push("/timetable")}
              />
            </Paper>
          </Grid>
          {/* Right: Focus Timer, Progress, Quick Note */}
          <Grid item xs={12} md={4}>
            <FocusPanel router={router} />
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
