"use client";

import React from "react";
import Image from "next/image";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function SplashScreen() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        minHeight: "100vh",
        height: "100vh",
        width: "100vw",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#1976d2",
        zIndex: 9999,
        p: 2, // add padding for extra safety
      }}
    >
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", overflow: "hidden" }}>
        <Image
          src="/logo.png"
          alt="Course Connect Logo"
          width={400}
          style={{
            width: "90vw",
            maxWidth: 220, 
            marginBottom: 36,
            display: "block",
          }}
          priority
        />
      </Box>
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
