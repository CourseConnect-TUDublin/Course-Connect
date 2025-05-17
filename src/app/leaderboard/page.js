"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText, Avatar, Box, CircularProgress } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rewards") // Endpoint should return leaderboard data
      .then((res) => res.json())
      .then((data) => {
        setLeaders(data.leaderboard || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            <EmojiEventsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Leaderboard
          </Typography>
          <List>
            {leaders.map((user, idx) => (
              <ListItem key={user._id || idx}>
                <Avatar src={user.avatar || ""} sx={{ mr: 2 }}>
                  {user.name?.[0] || "?"}
                </Avatar>
                <ListItemText
                  primary={`${idx + 1}. ${user.name || "Unknown"}`}
                  secondary={`Points: ${user.points} | Level: ${user.level}`}
                />
                {idx === 0 && <EmojiEventsIcon color="warning" />} {/* Gold icon for 1st */}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
