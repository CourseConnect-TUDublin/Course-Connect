"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  CircularProgress
} from "@mui/material";

export default function SessionRequestsOverview({ currentUser }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [requests, setRequests] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch("/api/sessions")
      .then(r => r.json())
      .then(all => {
        // find sessions where I'm invited & status is pending
        const mine = all.filter(s =>
          s.status === "pending" &&
          s.participants.some(p => p._id === userId)
        );
        setRequests(mine);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleConfirm = async (sessionId) => {
    // Mark the request confirmed
    await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" })
    });
    // Remove it from the local list
    setRequests(reqs => reqs.filter(r => r._id !== sessionId));
  };

  if (loading) return <CircularProgress size={24} />;
  if (error)   return <Typography color="error">{error}</Typography>;
  if (!requests || requests.length === 0) {
    return <Typography>No session requests.</Typography>;
  }

  return (
    <List>
      {requests.map((s) => (
        <ListItem key={s._id} alignItems="flex-start" divider>
          <ListItemAvatar>
            <Avatar src={s.host.avatar} alt={s.host.name} />
          </ListItemAvatar>
          <ListItemText
            primary={`Session on ${new Date(s.datetime).toLocaleString()}`}
            secondary={`Host: ${s.host.name}`}
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => handleConfirm(s._id)}
          >
            Confirm
          </Button>
        </ListItem>
      ))}
    </List>
  );
}
