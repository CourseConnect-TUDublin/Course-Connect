"use client";
import React, { useEffect, useState } from "react";
import { Container, Card, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { getLevelFromXP } from "@/utils/xpLevel";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch("/api/rewards")
      .then((res) => res.json())
      .then((data) => setLeaders(data.leaderboard || []));
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          🏆 Leaderboard
        </Typography>
        <List>
          {leaders.map((user, i) => (
            <ListItem key={user._id || i}>
              <ListItemAvatar>
                <Avatar src={user.avatar}>
                  {i === 0 ? <EmojiEventsIcon color="warning" /> : (user.name?.[0] || "?")}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <span>
                    <b>{user.name}</b> {i === 0 && <span>🥇</span>}
                  </span>
                }
                secondary={
                  <>
                    Points: <b>{user.points}</b> | Level: {getLevelFromXP(user.xp ?? 0)}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Card>
    </Container>
  );
}
