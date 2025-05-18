"use client";
import React, { useEffect, useState } from "react";
import { Box, Card, Typography, Chip, Stack, LinearProgress } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function RewardSummary({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, [userId]);

  if (!user) return null;

  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        🎯 Your Progress
      </Typography>
      <Typography>Points: <b>{user.points ?? 0}</b></Typography>
      <Typography>XP: <b>{user.xp ?? 0}</b></Typography>
      <Typography>Level: <b>{user.level ?? 1}</b></Typography>
      <Box sx={{ my: 1 }}>
        <LinearProgress
          value={((user.xp ?? 0) / ((user.level ?? 1) * 100)) * 100}
          variant="determinate"
          sx={{ height: 8, borderRadius: 5 }}
        />
        <Typography variant="caption">
          {user.xp ?? 0} / {(user.level ?? 1) * 100} XP to next level
        </Typography>
      </Box>
      {user.badges && user.badges.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
          {user.badges.map((badge) => (
            <Chip
              key={badge}
              label={badge}
              color="success"
              icon={<EmojiEventsIcon />}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      )}
    </Card>
  );
}
