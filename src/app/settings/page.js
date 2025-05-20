// src/app/settings/page.js
"use client";

import React from "react";
import { Container, Typography, Box, TextField, Button } from "@mui/material";

export default function SettingsPage() {
  return (
    <Container maxWidth="sm" sx={{ pt: 4, pb: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Settings
      </Typography>

      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
        <TextField label="Display Name" fullWidth variant="outlined" />
        <TextField label="Email Address" fullWidth variant="outlined" />
        <TextField label="New Password" type="password" fullWidth variant="outlined" />

        <Button variant="contained" color="primary">
          Save Changes
        </Button>
      </Box>
    </Container>
  );
}