// frontend/app/components/RecommendedBuddies.js
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Badge,
  ListItemText,
  CircularProgress
} from "@mui/material";

export default function RecommendedBuddies({ currentUser }) {
  const { data: session } = useSession();
  const myId = session?.user?.id;
  const [recs, setRecs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch("/api/studybuddies")
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((all) => {
        // find current user's subjects
        const me = all.find((u) => u._id === myId);
        const mySubjects = me?.subjects || [];

        // score others by shared-subject count
        const scored = all
          .filter((u) => u._id !== myId)
          .map((u) => {
            const shared = u.subjects?.filter((s) => mySubjects.includes(s)).length || 0;
            return { ...u, score: shared };
          })
          .filter((u) => u.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5); // top 5

        setRecs(scored);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        {error}
      </Typography>
    );
  }
  if (!recs || recs.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", py: 2 }}>
        No recommendations available.
      </Typography>
    );
  }

  return (
    <List>
      {recs.map(({ _id, name, avatar, status, score }) => {
        const badgeColor = {
          online: "success",
          offline: "default",
          busy: "warning"
        }[status] || "default";

        return (
          <ListItem key={_id} divider>
            <ListItemAvatar>
              <Badge
                overlap="circular"
                badgeContent=" "
                variant="dot"
                color={badgeColor}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Avatar src={avatar} alt={name} />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={name}
              secondary={`${score} shared subject${score !== 1 ? "s" : ""}`}
            />
          </ListItem>
        );
      })}
    </List>
  );
}
