"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  CircularProgress
} from "@mui/material";

export default function StudySessions() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/sessions?participantId=${userId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        console.log("StudySessions fetched:", data);
        return data;
      })
      .then((data) => setSessions(data))
      .catch((e) => {
        console.error("StudySessions error:", e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
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
  if (!sessions || sessions.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", py: 2 }}>
        No sessions found.
      </Typography>
    );
  }

  return (
    <>
      <List>
        {sessions.map((s) => {
          const dt = s.datetime ? new Date(s.datetime) : null;
          const dateLabel = dt && !isNaN(dt)
            ? dt.toLocaleString()
            : "Unknown date";

          const hostName = s.host?.name || "Unknown";

          const invited = Array.isArray(s.participants) && s.participants.length > 0
            ? s.participants.map((p) => p.name).join(", ")
            : "None";

          return (
            <ListItem key={s._id} divider alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={s.host?.avatar} alt={hostName} />
              </ListItemAvatar>
              <ListItemText
                primary={`${dateLabel} — Host: ${hostName}`}
                secondary={`Invited: ${invited}`}
              />
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ textAlign: "right", mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Box>
    </>
  );
}
