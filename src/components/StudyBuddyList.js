"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Avatar,
  ListItemText,
  Badge,
  CircularProgress,
  Box,
  Typography,
  Button
} from "@mui/material";
import { debounce } from "lodash";
import Link from "next/link";
import SessionRequestForm from "./SessionRequestForm";

export default function StudyBuddyList() {
  const { data: session } = useSession();
  const currentId = session?.user?.id;
  const [buddies, setBuddies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // For inline request form
  const [requestBuddyId, setRequestBuddyId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  // Debounced fetcher
  const fetchBuddies = useMemo(
    () =>
      debounce(async (q) => {
        setLoading(true);
        setError(null);
        try {
          const url = `/api/studybuddies${q ? `?search=${encodeURIComponent(q)}` : ""}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(res.statusText);
          let data = await res.json();
          // exclude self
          if (currentId) data = data.filter((b) => b._id !== currentId);
          setBuddies(data);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      }, 300),
    [currentId]
  );

  useEffect(() => {
    fetchBuddies(search);
    return () => {
      fetchBuddies.cancel();
    };
  }, [search, fetchBuddies]);

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search study buddies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {loading && (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {error && (
        <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <List>
          {buddies.map(({ _id, name, avatar, status }) => {
            const stat = status || "offline";
            const badgeColor = {
              online: "success",
              offline: "default",
              busy: "warning"
            }[stat];

            return (
              <ListItem key={_id} divider
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

      <SessionRequestForm
        open={formOpen}
        onClose={(didCreate) => {
          setFormOpen(false);
          setRequestBuddyId(null);
          // optionally refresh or show a toast if didCreate
        }}
        buddyId={requestBuddyId}
      />
    </Box>
  );
}
