"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore,
  HelpOutline,
  SupportAgent,
  Email,
} from "@mui/icons-material";

const faqs = [
  {
    question: "How do I reset my password?",
    answer: (
      <>
        Go to <b>Settings</b> &gt; <b>Change Password</b>, enter a new password, and save. If you forgot your current password, click <b>‘Forgot Password’</b> on the login screen.
      </>
    ),
  },
  {
    question: "Why am I not seeing my timetable?",
    answer: (
      <>
        Make sure you have added your modules via the Timetable page. If the problem persists, try refreshing or contact support.
      </>
    ),
  },
];

const troubleshooting = [
  {
    title: "Can’t log in?",
    detail: "Check your email and password are correct. Use ‘Forgot Password’ if needed.",
  },
  {
    title: "Feature not loading?",
    detail: "Try refreshing the page. Make sure you have a stable internet connection.",
  },
  {
    title: "App acting slow?",
    detail: "Clear your browser cache or try using Course Connect in an incognito window.",
  },
];

export default function HelpCenterPage() {
  const [expanded, setExpanded] = useState(false);
  const handleAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
      <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 2 }}>
        <HelpOutline color="primary" fontSize="large" />
        <Typography variant="h4" fontWeight={700}>
          Help Center
        </Typography>
      </Stack>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Welcome to the Course Connect Help Center. Find answers to common questions and troubleshoot quickly.
      </Typography>

      {/* FAQ Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Frequently Asked Questions
        </Typography>
        {faqs.map((faq, i) => (
          <Accordion
            key={i}
            expanded={expanded === i}
            onChange={handleAccordion(i)}
            sx={{ borderRadius: 2, mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight={600}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Troubleshooting Cards */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Quick Troubleshooting
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {troubleshooting.map((item, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card sx={{ borderRadius: 3, bgcolor: "#f4f6fa" }}>
              <CardContent>
                <Typography fontWeight={700}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.detail}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Contact Support */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Need more help?
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          If you can’t find what you need, reach out:
        </Typography>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
          <Tooltip title="Live Chat (Coming Soon)">
            <span>
              <IconButton color="primary" disabled>
                <SupportAgent />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Email Support">
            <IconButton
              color="primary"
              component="a"
              href="mailto:support@courseconnect.app"
            >
              <Email />
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          For urgent academic matters, contact your course team directly.
        </Typography>
      </Box>
    </Container>
  );
}
