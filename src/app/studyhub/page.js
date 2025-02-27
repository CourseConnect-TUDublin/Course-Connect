"use client";

import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import StudyBuddyList from "../../components/StudyBuddyList";
import Chat from "../../components/Chat";
import RecommendedBuddies from "../../components/RecommendedBuddies";
import SessionRequestsOverview from "../../components/SessionRequestsOverview";
import CalendarWidget from "../../components/CalendarWidget";
import StudySessions from "../../components/StudySessions";
import { useSession } from "next-auth/react";

export default function StudyHub() {
  const { data: session } = useSession();
  const currentUser = session?.user?.name || "Guest";

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
        Your one-stop hub for study-related activities: connect with study buddies, manage sessions, join live chats, and more.
      </Typography>

      <Grid container spacing={3}>
        {/* All Study Buddies */}
        <Grid item xs={12} md={6}>
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
              All Study Buddies
            </Typography>
            <StudyBuddyList />
          </Paper>
        </Grid>

        {/* Recommended Study Buddies */}
        <Grid item xs={12} md={6}>
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
              Recommended for You
            </Typography>
            <RecommendedBuddies currentUser={session?.user} />
          </Paper>
        </Grid>

        {/* Session Requests Overview */}
        <Grid item xs={12}>
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
              Session Requests
            </Typography>
            <SessionRequestsOverview currentUser={session?.user} />
          </Paper>
        </Grid>

        {/* Study Sessions */}
        <Grid item xs={12}>
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
              Study Sessions
            </Typography>
            <StudySessions />
          </Paper>
        </Grid>

        {/* Group Study Chat Room */}
        <Grid item xs={12}>
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
              Group Study Chat Room
            </Typography>
            <Chat room="studyhub-chat" currentUser={currentUser} />
          </Paper>
        </Grid>

        {/* Upcoming Sessions & Events */}
        <Grid item xs={12}>
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
              Upcoming Sessions & Events
            </Typography>
            <CalendarWidget />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
