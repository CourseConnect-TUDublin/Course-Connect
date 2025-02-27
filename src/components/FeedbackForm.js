// /src/components/FeedbackForm.js
"use client";

import React, { useState } from 'react';
import { Box, TextField, Button, Rating, Typography } from '@mui/material';

const FeedbackForm = ({ sessionId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');

  const submitFeedback = async () => {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, user: 'currentUserId', rating, comments })
    });
    if (res.ok) {
      onFeedbackSubmitted && onFeedbackSubmitted();
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Session Feedback</Typography>
      <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />
      <TextField
        label="Comments"
        multiline
        rows={3}
        fullWidth
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={submitFeedback} sx={{ mt: 2 }}>
        Submit Feedback
      </Button>
    </Box>
  );
};

export default FeedbackForm;
