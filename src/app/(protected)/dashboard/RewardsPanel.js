import useSWR from "swr";
import {
  Card, CardHeader, Divider, CardContent, Typography, List, ListItem, ListItemText, Chip, Box
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

// Fetcher function for SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function RewardsPanel() {
  // SWR for live leaderboard updates!
  const { data, isLoading, error } = useSWR("/api/rewards", fetcher, { refreshInterval: 10000 }); // Refresh every 10s
  const leaderboard = data?.leaderboard || [];

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
        {isLoading ? (
          <Typography variant="body2" color="text.secondary">Loading…</Typography>
        ) : error ? (
          <Typography variant="body2" color="error">Failed to load leaderboard.</Typography>
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
