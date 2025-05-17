import React, { useEffect, useState } from "react";
import {
  Card, CardHeader, Divider, CardContent, Typography, List, ListItem, ListItemText, Chip, Box
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function RewardsPanel() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const res = await fetch("/api/rewards");
        const data = await res.json();
        if (data.leaderboard) setLeaderboard(data.leaderboard);
      } catch (err) {
        // fallback
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  return (
    <Card>
      <CardHeader
        avatar={<EmojiEventsIcon sx={{ color: "#FFD700" }} />}
        title="Rewards & Leaderboard"
        sx={{ bgcolor: "#fffbe7" }}
      />
      <Divider />
      <CardContent>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
          Top Achievers
        </Typography>
        {loading ? (
          <Typography variant="body2" color="text.secondary">Loading…</Typography>
        ) : (
          <List dense>
            {leaderboard.map((user, i) => (
              <ListItem key={user._id || i} alignItems="flex-start" disablePadding>
                <ListItemText
                  primary={`${i + 1}. ${user.name}`}
                />
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", ml: 1 }}>
                  <Chip size="small" label={`Points: ${user.points}`} color="primary" />
                  <Chip size="small" label={`Level: ${user.level}`} color="secondary" />
                  {user.badges && user.badges.map((badge) => (
                    <Chip key={badge} size="small" label={badge} sx={{ bgcolor: "#e6ffe6", ml: 1 }} />
                  ))}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
