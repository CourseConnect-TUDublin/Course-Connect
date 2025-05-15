"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
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
        if (!response.ok) throw new Error("Network response was not ok");
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

  const joinSession = (sessionId) => {
    router.push(`/session/${sessionId}`);
  };

  if (loading) return <Typography>Loading sessions…</Typography>;
  if (error)
    return (
      <Typography color="error">
        Oops—couldn’t load sessions: {error}
      </Typography>
    );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Study Sessions
      </Typography>

      {sessions.length === 0 ? (
        <Typography>No sessions found.</Typography>
      ) : (
        sessions.map((session) => {
          // Destructure and null-safe property access
          const {
            _id,
            tutor,
            student,
            host,
            startTime,
            endTime,
            status,
          } = session;

          // Optional chaining + fallback URL
          const avatarUrl = host?.avatar ?? "/default-avatar.png";

          return (
            <Card key={_id} sx={{ mb: 2, p: 2 }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={avatarUrl}
                  alt={host?.name ?? "Host avatar"}
                  sx={{ mr: 2 }}
                />
                <Box flexGrow={1}>
                  <Typography variant="subtitle1">
                    <strong>Session ID:</strong> {_id}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Tutor:</strong>{" "}
                    {typeof tutor === "string"
                      ? tutor
                      : tutor?.name ?? "Unknown"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Student:</strong>{" "}
                    {typeof student === "string"
                      ? student
                      : student?.name ?? "Unknown"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Start Time:</strong>{" "}
                    {startTime
                      ? new Date(startTime).toLocaleString()
                      : "TBD"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>End Time:</strong>{" "}
                    {endTime ? new Date(endTime).toLocaleString() : "TBD"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Status:</strong> {status}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => joinSession(_id)}
                >
                  Join Session
                </Button>
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
};

export default SessionList;
