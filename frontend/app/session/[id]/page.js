// frontend/app/session/[id]/page.js
"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  CircularProgress
} from '@mui/material';
import Chat from '../../../components/Chat';
import { useSession } from 'next-auth/react';

export default function SessionPage() {
  const { id: sessionId } = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [sessionData, setSessionData] = useState(null);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch session details
  useEffect(() => {
    if (!sessionId) return;
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }
        const data = await res.json();
        setSessionData(data);
      } catch (err) {
        console.error("Failed to load session:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  // Timer for elapsed time since startTime
  useEffect(() => {
    if (!sessionData?.startTime) return;
    const startTs = new Date(sessionData.startTime).getTime();
    const update = () => {
      const now = Date.now();
      setTimer(Math.floor((now - startTs) / 1000));
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [sessionData?.startTime]);

  const currentUser = session?.user?.name ?? 'Guest';

  const handleEndSession = async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ended' }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      const updated = await res.json();
      setSessionData(updated);
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Study Session
        </Typography>
        <Typography variant="body1">
          <strong>ID:</strong> {sessionData._id}
        </Typography>
        <Typography variant="body1">
          <strong>Status:</strong> {sessionData.status}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Host:</strong> {sessionData.host?.name ?? 'Unknown'}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Participants:</strong>
        </Typography>
        <List dense>
          {sessionData.participants?.map((p) => (
            <ListItem key={p._id}>
              <ListItemAvatar>
                <Avatar src={p.avatar ?? '/default-avatar.png'} alt={p.name} />
              </ListItemAvatar>
              <ListItemText primary={p.name ?? 'Unknown'} />
            </ListItem>
          ))}
        </List>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Elapsed Time:</strong>{' '}
          {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
        </Typography>
        {sessionData.host?._id === session?.user?.id && (
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 3 }}
            onClick={handleEndSession}
          >
            End Session
          </Button>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Chat room={`session-${sessionData._id}`} currentUser={currentUser} />
      </Paper>
    </Box>
  );
}
