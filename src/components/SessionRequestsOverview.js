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

export default function SessionRequestsOverview() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [requests, setRequests] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    fetch(`/api/sessions?participantId=${userId}&status=pending`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((all) => setRequests(all))
      .catch((e) => {
        console.error("SessionRequestsOverview error:", e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleConfirm = async (sessionId) => {
    await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" })
    });
    setRequests((prev) => prev.filter((r) => r._id !== sessionId));
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", py: 2 }}>
        {error}
      </Typography>
    );
  }
  if (!requests?.length) {
    return (
      <Typography sx={{ textAlign: "center", py: 2 }}>
        No session requests.
      </Typography>
    );
  }

  return (
    <List>
      {requests.map((s) => {
        // safe-access host properties and provide defaults
        const avatarUrl = s.host?.avatar ?? "/default-avatar.png";
        const hostName  = s.host?.name   ?? "Unknown Host";
        const dateLabel = s.datetime
          ? new Date(s.datetime).toLocaleString()
          : "TBD";

        return (
          <ListItem
            key={s._id}
            alignItems="flex-start"
            divider
            secondaryAction={
              <Button
                variant="contained"
                size="small"
                onClick={() => handleConfirm(s._id)}
              >
                Confirm
              </Button>
            }
          >
            <ListItemAvatar>
              <Avatar src={avatarUrl} alt={hostName} />
            </ListItemAvatar>
            <ListItemText
              primary={`Session on ${dateLabel}`}
              secondary={`Host: ${hostName}`}
            />
          </ListItem>
        );
      })}
    </List>
  );
}
