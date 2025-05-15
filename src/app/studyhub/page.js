"use client";

import React from "react";
import { Box, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

// Core components
import StudyBuddyList          from "../../components/StudyBuddyList";
import RecommendedBuddies      from "../../components/RecommendedBuddies";
import SessionRequestsOverview from "../../components/SessionRequestsOverview";
import StudySessions           from "../../components/StudySessions";

// Dynamically import heavier or non-SSR pieces
const Chat           = dynamic(() => import("../../components/Chat"), { ssr: false });
const CalendarWidget = dynamic(() => import("../../components/CalendarWidget"), { ssr: false });

// A reusable card wrapper for consistent styling
const HubCard = ({ title, children }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      borderRadius: 2,
      backgroundColor: "#ffffff",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
    }}
  >
    <Typography variant="h6" gutterBottom sx={{ color: "#3f51b5" }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

export default function StudyHub() {
  const { data: session, status } = useSession();

  // Show a full‐screen loader while session is resolving
  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const currentUser = session?.user?.name || "Guest";

  return (
    <Box
      sx={{
        p: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3, color: "#333" }}>
        Study Hub
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: "#555" }}>
        Your one‐stop hub for study‐related activities: connect with study buddies, manage sessions, join live chats, and more.
      </Typography>

      <Grid container spacing={3}>
        {/* All Study Buddies */}
        <Grid item xs={12} md={6}>
          <HubCard title="All Study Buddies">
            <StudyBuddyList />
          </HubCard>
        </Grid>

        {/* Recommended Study Buddies */}
        <Grid item xs={12} md={6}>
          <HubCard title="Recommended for You">
            <RecommendedBuddies />
          </HubCard>
        </Grid>

        {/* Session Requests Overview */}
        <Grid item xs={12}>
          <HubCard title="Session Requests">
            <SessionRequestsOverview />
          </HubCard>
        </Grid>

        {/* Study Sessions */}
        <Grid item xs={12}>
          <HubCard title="Study Sessions">
            <StudySessions />
          </HubCard>
        </Grid>

        {/* Group Study Chat Room */}
        <Grid item xs={12}>
          <HubCard title="Group Study Chat Room">
            <Chat room="studyhub-chat" currentUser={currentUser} />
          </HubCard>
        </Grid>

        {/* Upcoming Sessions & Events */}
        <Grid item xs={12}>
          <HubCard title="Upcoming Sessions & Events">
            <CalendarWidget />
          </HubCard>
        </Grid>
      </Grid>
    </Box>
  );
}
