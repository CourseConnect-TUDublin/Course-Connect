"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography
} from '@mui/material';
import CreateSessionForm from './CreateSessionForm';
import { useSession } from 'next-auth/react';

export default function StudySessions() {
  const { data: session, status } = useSession();
  const currentUser = session?.user || {};
  const [sessions, setSessions] = useState(null);
  const [open, setOpen] = useState(false);

  // Load only this user's sessions whenever their ID is known
  useEffect(() => {
    if (!currentUser.id) return;
    fetch(`/api/sessions?user=${currentUser.id}`)
      .then(r => r.json())
      .then(data => setSessions(data));
  }, [currentUser.id]);

  // Refresh helper
  const refresh = () => {
    if (!currentUser.id) return;
    fetch(`/api/sessions?user=${currentUser.id}`)
      .then(r => r.json())
      .then(data => setSessions(data));
  };

  // Show loader while sessions are loading
  if (status === 'loading' || sessions === null) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        New Session
      </Button>

      {sessions.length === 0 ? (
        <Typography>No sessions scheduled yet.</Typography>
      ) : (
        <List>
          {sessions.map(s => {
            const dateStr   = new Date(s.startTime).toLocaleString();
            const tutorName = s.tutor?.name || 'Unknown';
            const invited   = Array.isArray(s.student)
              ? s.student.map(p => p.name).join(', ')
              : '';

            return (
              <ListItem key={s._id} divider>
                <ListItemText
                  primary={`${dateStr} — Host: ${tutorName}`}
                  secondary={`Invited: ${invited}`}
                />
              </ListItem>
            );
          })}
        </List>
      )}

      <CreateSessionForm
        open={open}
        currentUser={currentUser}
        onClose={didCreate => {
          setOpen(false);
          if (didCreate) refresh();
        }}
      />
    </Box>
  );
}
