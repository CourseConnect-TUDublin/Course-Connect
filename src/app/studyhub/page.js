// src/app/studyhub/page.js
"use client";

import React from "react";
import { Box, Grid, Paper, Typography, CircularProgress, Button } from "@mui/material";
import { useSession, signIn } from "next-auth/react";
import dynamic from "next/dynamic";

// Core components
import StudyBuddyList           from "../../components/StudyBuddyList";
import RecommendedBuddies       from "../../components/RecommendedBuddies";
import SessionRequestsOverview  from "../../components/SessionRequestsOverview";
import StudySessions            from "../../components/StudySessions";

// Dynamically imported (no SSR)
const Chat           = dynamic(() => import("../../components/Chat"), { ssr: false });
const CalendarWidget = dynamic(() => import("../../components/CalendarWidget"), { ssr: false });

// Reusable card wrapper
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

  // 1) Loading state
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

  // 2) Not signed in
  if (!session) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Please Sign In
        </Typography>
        <Button variant="contained" onClick={() => signIn()}>
          Sign In
        </Button>
      </Box>
    );
  }

  const user = session.user; // full user object, e.g. { id, name, email, role }

  return (
    <Box
      sx={{
        p: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 3, color: "#333" }}
      >
        Study Hub
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: "#555" }}>
        Your one-stop hub for study-related activities: connect with study buddies,
        manage sessions, join live chats, and more.
      </Typography>

      <Grid container spacing={3}>
        {/* 1. All Study Buddies */}
        <Grid item xs={12} md={6}>
          <HubCard title="All Study Buddies">
            <StudyBuddyList />
          </HubCard>
        </Grid>

        {/* 2. Recommended for You */}
        <Grid item xs={12} md={6}>
          <HubCard title="Recommended for You">
            <RecommendedBuddies currentUser={user} />
          </HubCard>
        </Grid>

        {/* 3. Session Requests */}
        <Grid item xs={12}>
          <HubCard title="Session Requests">
            <SessionRequestsOverview currentUser={user} />
          </HubCard>
        </Grid>

        {/* 4. Study Sessions */}
        <Grid item xs={12}>
          <HubCard title="Study Sessions">
            <StudySessions currentUser={user} />
          </HubCard>
        </Grid>

        {/* 5. Group Study Chat Room */}
        <Grid item xs={12}>
          <HubCard title="Group Study Chat Room">
            <Chat room="studyhub-chat" currentUser={user} />
          </HubCard>
        </Grid>

        {/* 6. Upcoming Sessions & Events */}
        <Grid item xs={12}>
          <HubCard title="Upcoming Sessions & Events">
            <CalendarWidget />
          </HubCard>
        </Grid>
      </Grid>
    </Box>
  );
}
