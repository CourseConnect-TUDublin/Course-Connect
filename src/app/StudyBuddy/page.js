"use client";

import React from 'react';
import { Box } from '@mui/material';
import StudyBuddyList from '../../components/StudyBuddyList';

export default function StudyBuddyPage() {
  return (
    <Box sx={{ p: 3 }}>
      <StudyBuddyList />
    </Box>
  );
}
