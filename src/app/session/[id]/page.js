"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Paper } from '@mui/material';
import Chat from '../../../components/Chat';
import { useSession } from 'next-auth/react';

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id;
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/sessions?id=${sessionId}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setSessionData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) return <Typography>Loading session details...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  // Use the actual user name from your session, or fallback to "Guest"
  const currentUser = session?.user?.name || 'Guest';

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Session Details
        </Typography>
        <Typography variant="body1">
          <strong>Session ID:</strong> {sessionData._id}
        </Typography>
        <Typography variant="body1">
          <strong>Tutor:</strong> {sessionData.tutor}
        </Typography>
        <Typography variant="body1">
          <strong>Student:</strong> {sessionData.student}
        </Typography>
        {/* Add more session details here if needed */}
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Chat room={`session-${sessionData._id}`} currentUser={currentUser} />
      </Paper>
    </Box>
  );
}
