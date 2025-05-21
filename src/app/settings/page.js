"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Divider,
  Stack,
  IconButton,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Delete, Logout, DarkMode, LightMode, SettingsBrightness } from "@mui/icons-material";
import { useSession, signOut } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("auto");
  const [newPassword, setNewPassword] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fetch real user info on load
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) throw new Error("Failed to load user info");
        const data = await res.json();
        setDisplayName(data.name || "");
        setEmail(data.email || "");
        setTheme(data.theme || "auto");
      } catch (err) {
        setSnackbar({ open: true, message: err.message, severity: "error" });
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  // Save name, email, theme
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName, email, theme }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }
      setSnackbar({ open: true, message: "Profile updated!", severity: "success" });
      await update(); // update NextAuth session info
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
    setLoading(false);
  };

  // Change password
  const handlePasswordChange = async () => {
    if (!newPassword) return;
    setLoading(true);
    try {
      const res = await fetch("/api/users/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change password");
      }
      setSnackbar({ open: true, message: "Password changed!", severity: "success" });
      setNewPassword("");
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
    setLoading(false);
  };

  // Logout
  const handleLogout = () => signOut({ callbackUrl: "/" });

  // Delete account
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/me", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete account");
      setSnackbar({ open: true, message: "Account deleted.", severity: "success" });
      setTimeout(() => signOut({ callbackUrl: "/" }), 1200);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    }
    setLoading(false);
    setConfirmDelete(false);
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ pt: 4, pb: 6, minHeight: "80vh" }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ pt: 4, pb: 6, minHeight: "80vh" }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Settings
      </Typography>

      {/* --- Profile Section --- */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ width: 68, height: 68, mr: 2, border: '2px solid #eee', bgcolor: "#bdbdbd" }}>
          {displayName ? displayName.charAt(0).toUpperCase() : ""}
        </Avatar>
        <Box>
          <Typography fontWeight={600}>{displayName}</Typography>
          <Typography variant="body2" color="text.secondary">{email}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* --- Account Info Form --- */}
      <form onSubmit={handleSave}>
        <Stack spacing={3}>
          <TextField
            label="Display Name"
            fullWidth
            variant="outlined"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
          <TextField
            label="Email Address"
            fullWidth
            variant="outlined"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          {/* --- Theme Selector --- */}
          <TextField
            select
            label="Theme"
            value={theme}
            onChange={e => setTheme(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment:
                theme === "light" ? <LightMode sx={{ mr: 1 }} /> :
                theme === "dark" ? <DarkMode sx={{ mr: 1 }} /> :
                <SettingsBrightness sx={{ mr: 1 }} />,
            }}
          >
            <MenuItem value="auto">Auto</MenuItem>
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </TextField>

          <Button variant="contained" color="primary" type="submit" size="large" disabled={loading}>
            Save Changes
          </Button>
        </Stack>
      </form>

      {/* --- Password Section --- */}
      <Divider sx={{ my: 4 }} />
      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Change Password
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            disabled={!newPassword || loading}
            onClick={handlePasswordChange}
          >
            Change
          </Button>
        </Stack>
      </Box>

      {/* --- Danger/Account Actions --- */}
      <Divider sx={{ my: 4 }} />
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => setConfirmDelete(true)}
        >
          Delete Account
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* Confirm delete dialog */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
