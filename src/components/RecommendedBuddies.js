"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { findMatches } from '../utils/matchUsers';

const RecommendedBuddies = ({ currentUser }) => {
  const router = useRouter();
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchBuddies = async () => {
      const res = await fetch('/api/studybuddies');
      if (res.ok) {
        const data = await res.json();
        const matches = findMatches(currentUser, data);
        setRecommended(matches);
      }
    };
    fetchBuddies();
  }, [currentUser]);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5">Recommended Study Buddies</Typography>
      {recommended.map(({ user, score }) => (
        <Card key={user._id} sx={{ mb: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body2">
              <strong>Match Score:</strong> {score}
            </Typography>
            <Button variant="contained" color="primary" onClick={() => router.push(`/StudyBuddy/${user._id}`)}>
              View Profile
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default RecommendedBuddies;
