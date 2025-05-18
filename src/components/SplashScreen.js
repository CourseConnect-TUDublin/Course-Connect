"use client";
import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function SplashScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fff", // white background
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#1976d2",
      }}
    >
      
      <img
        src="/logo.png"
        alt="Course Connect Logo"
        style={{
          width: "40vw",
          maxWidth: 1240,
          minWidth: 1120,
          height: "auto",
          marginBottom: 36,
          display: "block",
        }}
      />

      <Typography variant="h3" fontWeight={700} mb={2} color="inherit" align="center">
        Course Connect
      </Typography>
      <Typography variant="h6" mb={3} color="inherit" align="center">
        Loading, please wait…
      </Typography>
      <CircularProgress color="inherit" size={48} />
    </Box>
  );
}
