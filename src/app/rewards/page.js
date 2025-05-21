"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Chip, CircularProgress, Grid } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { getLevelFromXP } from "@/utils/xpLevel";

export default function RewardsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ minHeight: "40vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography color="error">Unable to load your rewards.</Typography>
      </Box>
    );
  }

  const level = getLevelFromXP(user.xp ?? 0);

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            <EmojiEventsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            My Rewards
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">Level:</Typography>
              <Typography variant="h6">{level}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">XP:</Typography>
              <Typography variant="h6">{user.xp ?? 0}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">Points:</Typography>
              <Typography variant="h6">{user.points ?? 0}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">Current Streak:</Typography>
              <Typography variant="h6">{user.streak ?? 0} days</Typography>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              Badges:
            </Typography>
            {Array.isArray(user.badges) && user.badges.length > 0 ? (
              user.badges.map((badge, idx) => (
                <Chip
                  key={badge + idx}
                  label={badge}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                  icon={<EmojiEventsIcon />}
                />
              ))
            ) : (
              <Typography variant="body2">No badges yet – complete tasks to earn some!</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
