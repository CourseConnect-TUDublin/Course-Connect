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
        console.log("Fetching", url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let data = await res.json();
        console.log("Data", data);
        // Exclude current user
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

  // Apply online filter
  const displayed = filter === "online"
    ? buddies.filter(b => b.status === "online")
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
          {displayed.map(({ _id, name, avatar, status }) => {
            const stat = status || "offline";
            const badgeColor = {
              online:  "success",
              offline: "default",
              busy:    "warning"
            }[stat] || "default";

            return (
              <ListItem
                key={_id}
                divider
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
                disablePadding
              >
                <ListItemButton component={Link} href={`/StudyBuddy/${_id}`}>
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
                    secondary={stat.charAt(0).toUpperCase() + stat.slice(1)}
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
          // optionally refetch or notify on didCreate
        }}
      />
    </Box>
  );
}
