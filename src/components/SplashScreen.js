"use client";

import React from "react";
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
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100vw",
          maxWidth: 220,          
          aspectRatio: "3/1",     
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 3,
          overflow: "hidden",
        }}
      >
        <img
          src="/logo.png"
          alt="Course Connect Logo"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            display: "block",
          }}
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
