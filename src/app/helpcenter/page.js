// src/app/helpcenter/page.js
"use client";

import React from "react";
import { Container, Typography, Box } from "@mui/material";

export default function HelpCenterPage() {
  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Help Center
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Welcome to the Course Connect Help Center. Here you’ll find FAQs, troubleshooting guides,
        and contact support details. For urgent assistance, reach out to your course support team.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">FAQs</Typography>
        <ul>
          <li>How do I reset my password?</li>
          <li>Why am I not seeing my timetable?</li>
          <li>How can I connect with a study buddy?</li>
        </ul>
      </Box>
    </Container>
  );
}