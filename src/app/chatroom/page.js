// src/app/chatroom/page.js
"use client";

import React from "react";
import { useSession, signIn } from "next-auth/react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";

// Dynamically import Chat (no SSR)
const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

export default function ChatroomPage() {
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
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Please Sign In to Join the Chat
        </Typography>
        <Button variant="contained" onClick={() => signIn()}>
          Sign In
        </Button>
      </Box>
    );
  }

  const currentUser = session.user.name ?? session.user.id;

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Study Hub Chat Room
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Welcome, {currentUser}! Chat with other learners in real time.
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Chat room="studyhub" currentUser={currentUser} />
      </Box>
    </Box>
  );
}
