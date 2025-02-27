"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";

const SessionList = () => {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/sessions");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSessions(data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Handler for joining a session
  const joinSession = (sessionId) => {
    // Redirect to the dynamic session page
    router.push(`/session/${sessionId}`);
  };

  if (loading) return <Typography>Loading sessions...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Study Sessions
      </Typography>
      {sessions.length === 0 ? (
        <Typography>No sessions found.</Typography>
      ) : (
        sessions.map((session) => (
          <Card key={session._id} sx={{ mb: 2, p: 2 }}>
            <CardContent>
              <Typography variant="subtitle1">
                <strong>Session ID:</strong> {session._id}
              </Typography>
              <Typography variant="body1">
                <strong>Tutor:</strong> {session.tutor}
              </Typography>
              <Typography variant="body1">
                <strong>Student:</strong> {session.student}
              </Typography>
              <Typography variant="body1">
                <strong>Start Time:</strong>{" "}
                {new Date(session.startTime).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                <strong>End Time:</strong>{" "}
                {new Date(session.endTime).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {session.status}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 1 }}
                onClick={() => joinSession(session._id)}
              >
                Join Session
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default SessionList;
