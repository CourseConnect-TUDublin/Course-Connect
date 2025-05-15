"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';

export default function SessionRequestsOverview() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [requests, setRequests] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  // Fetch pending requests for me
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/session-requests?to=${userId}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setRequests(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  // Handler to accept or decline
  const handleAction = async (reqId, action) => {
    setLoading(true);
    await fetch(`/api/session-requests/${reqId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    // Re-fetch after updating
    fetch(`/api/session-requests?to=${userId}`)
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>
        Failed to load requests: {error}
      </Typography>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <Typography sx={{ textAlign: 'center', py: 2 }}>
        No session requests found.
      </Typography>
    );
  }

  return (
    <List>
      {requests.map(req => {
        // Use startTime instead of old datetime
        const dateStr = new Date(req.sessionId.startTime).toLocaleString();

        return (
          <ListItem key={req._id} divider alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src={req.from.avatar} alt={req.from.name} />
            </ListItemAvatar>
            <ListItemText
              primary={`${req.from.name} invited you to a session on ${dateStr}`}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleAction(req._id, 'accept')}
              >
                Accept
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleAction(req._id, 'decline')}
              >
                Decline
              </Button>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
}
