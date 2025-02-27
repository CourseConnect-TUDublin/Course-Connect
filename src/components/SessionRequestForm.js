// /src/components/SessionRequestForm.js
"use client";

import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const SessionRequestForm = ({ buddyId, onRequestSent }) => {
  const [preferredTimes, setPreferredTimes] = useState('');
  const [message, setMessage] = useState('');

  // Replace this with the actual logged-in user's ObjectId for production.
  const currentUserId = "63f99ed37b2b9c1d2f4af6a5"; 

  const handleSubmit = async () => {
    console.log("Submitting session request...");

    try {
      const res = await fetch('/api/session-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requester: currentUserId,
          buddy: buddyId,
          preferredTimes: preferredTimes.split(',').map(time => time.trim()),
          message
        })
      });

      if (res.ok) {
        console.log("Session request submitted successfully");
        onRequestSent && onRequestSent();
        alert("Session request sent!");
      } else {
        console.error("Failed to send session request", res.statusText);
        alert("Failed to send request.");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("An error occurred.");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Request a Session</Typography>
      <TextField
        label="Preferred Times (comma separated)"
        variant="outlined"
        fullWidth
        value={preferredTimes}
        onChange={(e) => setPreferredTimes(e.target.value)}
        sx={{ mt: 1 }}
      />
      <TextField
        label="Message"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mt: 1 }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
        Send Request
      </Button>
    </Box>
  );
};

export default SessionRequestForm;
