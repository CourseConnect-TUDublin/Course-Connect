// src/app/studybuddy/page.js
"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import StudyBuddyList from '../../components/StudyBuddyList';
import Chat from '../../components/Chat';

export default function StudyBuddyPage() {
  const { data: session } = useSession();
  const currentUser = session?.user?.name ?? 'Guest';

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Study Buddies
      </Typography>

      {/* Your existing buddies list */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <StudyBuddyList />
      </Paper>

      {/* Live chat area */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Buddy Chat Room
        </Typography>
        <Chat room="studybuddy" currentUser={currentUser} />
      </Paper>
    </Box>
  );
}
