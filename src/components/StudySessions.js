"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const StudySessions = () => {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();
        if (data.success) {
          setSessions(data.data);
        } else {
          console.error("Error fetching sessions", data.error);
        }
      } catch (error) {
        console.error("Error fetching sessions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <Typography>Loading study sessions...</Typography>;

  return (
    <Box>
      {sessions.length === 0 ? (
        <Typography>No study sessions found.</Typography>
      ) : (
        sessions.map((session) => (
          <Card key={session._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">
                {session.title || "Study Session"}
              </Typography>
              <Typography variant="body2">
                {new Date(session.startTime).toLocaleString()} -{" "}
                {new Date(session.endTime).toLocaleString()}
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push(`/session/${session._id}`)}
                sx={{ mt: 1 }}
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

export default StudySessions;
