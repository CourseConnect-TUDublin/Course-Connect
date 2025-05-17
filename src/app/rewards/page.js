"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Chip, CircularProgress, Grid } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function RewardsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user's rewards info (adjust the API endpoint as needed)
  useEffect(() => {
    fetch("/api/users/me") // <-- Replace with your actual endpoint to get current user
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
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
            My Rewards
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">Level:</Typography>
              <Typography variant="h6">{user.level}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">XP:</Typography>
              <Typography variant="h6">{user.xp}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">Points:</Typography>
              <Typography variant="h6">{user.points}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">Current Streak:</Typography>
              <Typography variant="h6">{user.streak} days</Typography>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              Badges:
            </Typography>
            {user.badges && user.badges.length > 0 ? (
              user.badges.map((badge) => (
                <Chip
                  key={badge}
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
