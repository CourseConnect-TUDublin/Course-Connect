"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 2,
        textAlign: "center",
        borderTop: "1px solid #eaeaea",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Course Connect. All rights reserved.
      </Typography>
    </Box>
  );
}
