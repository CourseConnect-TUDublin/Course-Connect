"use client";
import useSWR from "swr";
import React from "react";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ProfilePage() {
  const { data: user, isLoading, mutate } = useSWR("/api/users/me", fetcher);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    theme: "",
  });
  const [saving, setSaving] = useState(false);

  // Prefill form when user data loads
  React.useEffect(() => {
    if (user && !editing) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        theme: user.theme || "",
      });
    }
  }, [user, editing]);

  const handleEdit = () => setEditing(true);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await mutate(); // Refresh user data
        setEditing(false);
      }
    } catch {}
    setSaving(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Typography color="error">Failed to load profile.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Card elevation={4}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar sx={{ width: 56, height: 56 }}>
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>{user.name}</Typography>
              <Typography color="text.secondary">{user.email}</Typography>
            </Box>
          </Box>

          {/* XP, Level, Points, Streak */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Chip label={`XP: ${user.xp ?? 0}`} color="primary" />
            <Chip label={`Level: ${user.level ?? 1}`} color="secondary" />
            <Chip label={`Points: ${user.points ?? 0}`} />
            <Chip label={`Streak: ${user.streak ?? 0}d`} />
          </Stack>

          {/* Badges */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Badges:</Typography>
            {user.badges && user.badges.length > 0 ? (
              user.badges.map((b) => (
                <Chip
                  key={b}
                  label={b}
                  icon={<EmojiEventsIcon />}
                  color="success"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No badges yet
              </Typography>
            )}
          </Box>

          {/* Editable fields */}
          {editing ? (
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled // usually email is not editable, but can enable if allowed
              />
              <TextField
                label="Theme"
                name="theme"
                value={form.theme}
                onChange={handleChange}
                placeholder="auto, light, dark"
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </Box>
          ) : (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ mt: 2 }}
            >
              Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
