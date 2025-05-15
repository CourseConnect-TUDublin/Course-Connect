// src/components/SessionDetailsDialog.js
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@mui/material";

export default function SessionDetailsDialog({ open, onClose, sessionId }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !sessionId) return;
    setLoading(true);
    fetch(`/api/sessions/${sessionId}`)
      .then(r => r.json())
      .then(data => setSession(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open, sessionId]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Session Details</DialogTitle>
      <DialogContent dividers sx={{ minWidth: 400 }}>
        {loading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress />
          </Box>
        ) : !session ? (
          <Typography color="error">Failed to load details.</Typography>
        ) : (
          <>
            <Typography gutterBottom>
              <strong>When:</strong>{" "}
              {new Date(session.startTime).toLocaleString()} –{" "}
              {new Date(session.endTime).toLocaleTimeString()}
            </Typography>
            <Typography gutterBottom>
              <strong>Host:</strong> {session.tutor.name}
            </Typography>
            <Typography gutterBottom>
              <strong>Participants:</strong>
            </Typography>
            <List dense>
              {session.student.map(p => (
                <ListItem key={p._id}>
                  <ListItemAvatar>
                    <Avatar src={p.avatar} alt={p.name} />
                  </ListItemAvatar>
                  <ListItemText primary={p.name} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
