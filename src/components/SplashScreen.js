"use client";

import React from "react";
import Image from "next/image";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function SplashScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#1976d2",
      }}
    >
      <Image
        src="/logo.png"
        alt="Course Connect Logo"
        width={400}              // Used for layout (will shrink for mobile)
        height={200}             // Adjust to match logo aspect ratio
        style={{
          width: "80vw",         // Responsive: 80% of viewport width
          maxWidth: 400,         // Never bigger than 400px
          height: "auto",
          marginBottom: 36,
          display: "block",
        }}
        priority
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
