// /src/app/StudyBuddy/[id]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import SessionRequestForm from '../../../components/SessionRequestForm'; // Adjust the path as needed

export default function StudyBuddyProfile() {
  const params = useParams();
  const buddyId = params.id;
  const [buddy, setBuddy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuddy = async () => {
      try {
        const res = await fetch(`/api/studybuddies?id=${buddyId}`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setBuddy(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuddy();
  }, [buddyId]);

  if (loading) return <Typography>Loading profile...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {`${buddy.name}'s Profile`}
      </Typography>
      {/* Other profile details here */}
      {/* Render the session request form */}
      <SessionRequestForm buddyId={buddy._id} onRequestSent={() => console.log("Session request sent!")} />
    </Box>
  );
}
