// src/components/StudyBuddyList.js
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Avatar,
  ListItemText,
  Badge,
  CircularProgress,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button
} from "@mui/material";
import { debounce } from "lodash";
import Link from "next/link";
import SessionRequestForm from "./SessionRequestForm";

// Helper to determine if user is online (active in last 5 min)
function isOnline(lastActive) {
  if (!lastActive) return false;
  return Date.now() - new Date(lastActive).getTime() < 5 * 60 * 1000;
}

export default function StudyBuddyList() {
  const { data: session } = useSession();
  const currentId = session?.user?.id;

  const [buddies, setBuddies]         = useState([]);
  const [search, setSearch]           = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [filter, setFilter]           = useState("all");  // all | online
  const [requestBuddyId, setRequestBuddyId] = useState(null);
  const [formOpen, setFormOpen]       = useState(false);

  // Debounced fetch
  const fetchBuddies = useMemo(() =>
    debounce(async q => {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/studybuddies${q ? `?search=${encodeURIComponent(q)}` : ""}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let data = await res.json();
        if (currentId) data = data.filter(b => b._id !== currentId);
        setBuddies(data);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }, 300)
  , [currentId]);

  useEffect(() => {
    fetchBuddies(search);
    return () => fetchBuddies.cancel();
  }, [search, fetchBuddies]);

  // Use lastActive for "online" filter
  const displayed = filter === "online"
    ? buddies.filter(b => isOnline(b.lastActive))
    : buddies;

  return (
    <Box>
      {/* Search + Filter */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search buddies…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, v) => v && setFilter(v)}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="online">Online Now</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Loading / Error / Empty */}
      {loading && (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {error && (
        <Typography color="error" sx={{ textAlign: "center", py: 2 }}>
          {error}
        </Typography>
      )}
      {!loading && !error && displayed.length === 0 && (
        <Typography sx={{ textAlign: "center", py: 2 }}>
          No study buddies found.
        </Typography>
      )}

      {/* Buddy List */}
      {!loading && !error && displayed.length > 0 && (
        <List>
          {displayed.map(({ _id, name, avatar, lastActive }) => {
            const online = isOnline(lastActive);
            const badgeColor = online ? "success" : "default";
            const statText = online ? "Online" : "Offline";

            // deterministic DM room id
            const roomId = [currentId, _id].sort().join("_");

            return (
              <ListItem
                key={_id}
                divider
                disablePadding
                secondaryAction={
                  <Button
                    size="small"
                    onClick={() => {
                      setRequestBuddyId(_id);
                      setFormOpen(true);
                    }}
                  >
                    Request
                  </Button>
                }
              >
                {/* Link to DM room */}
                <ListItemButton
                  component={Link}
                  href={`/dm/${roomId}`}
                >
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
                    secondary={statText}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}

      {/* Session Request Dialog */}
      <SessionRequestForm
        open={formOpen}
        buddyId={requestBuddyId}
        onClose={(didCreate) => {
          setFormOpen(false);
          setRequestBuddyId(null);
        }}
      />
    </Box>
  );
}
