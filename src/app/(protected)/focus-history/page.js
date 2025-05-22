"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Chip, CircularProgress } from "@mui/material";

export default function FocusHistoryPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/focus-log/history");
        const json = await res.json();
        if (json.success) setLogs(json.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}><CircularProgress /></div>;
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>📓 Focus Session History</Typography>
      {logs.length === 0 ? (
        <Typography>No sessions logged yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {logs.map((log) => (
            <Grid item xs={12} key={log._id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6">
                    {log.module || "Unspecified Module"}
                    {" "}
                    <Chip
                      label={log.type === "complete" ? "Completed" : "Stopped"}
                      size="small"
                      color={log.type === "complete" ? "success" : "warning"}
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(log.startTime).toLocaleString()} → {new Date(log.endTime).toLocaleTimeString()}
                  </Typography>
                  <Typography>
                    ⏱ Intended: {log.intendedDuration} min — Actual: {log.actualDuration} min
                  </Typography>
                  <Typography>
                    🪙 XP Earned: <strong>{log.xpEarned}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </main>
  );
}
