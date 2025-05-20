"use client";

import React from "react";
import Image from "next/image";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function SplashScreen() {
  return (
    <Box
      sx={{
        position: "fixed",       // Cover the entire viewport
        inset: 0,                // Top: 0, right: 0, bottom: 0, left: 0
        minHeight: "100vh",
        height: "100vh",
        width: "100vw",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#1976d2",
        zIndex: 9999,            // Make sure it appears above other content
      }}
    >
      <Image
        src="/logo.png"
        alt="Course Connect Logo"
        width={400}
        height={200}
        style={{
          width: "80vw",
          maxWidth: 400,
          height: "auto",
          marginBottom: 36,
          display: "block",
        }}
        priority
      />
      <Typography
        variant="h3"
        fontWeight={700}
        mb={2}
        color="inherit"
        align="center"
      >
        Course Connect
      </Typography>
      <Typography
        variant="h6"
        mb={3}
        color="inherit"
        align="center"
      >
        Loading, please wait…
      </Typography>
      <CircularProgress color="inherit" size={48} />
    </Box>
  );
}
