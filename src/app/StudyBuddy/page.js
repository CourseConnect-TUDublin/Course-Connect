"use client";
import React from 'react';
import Link from 'next/link';
import { Box, Typography, List, ListItem, ListItemAvatar,
         ListItemButton, Avatar, Badge, ListItemText } from '@mui/material';
import StudyBuddyList from '../../components/StudyBuddyList';

export default function StudyBuddyPage() {
  return (
    <Box sx={{ p:3 }}>
      <Typography variant="h4" gutterBottom>Study Buddies</Typography>
      {/* if you want to keep search + filter here, embed StudyBuddyList directly */}
      <StudyBuddyList />
      {/* or render a simple link list: */}
      {/* <List>
        {buddies.map(b=>(
          <ListItem key={b._id} disablePadding divider>
            <ListItemButton component={Link} href={`/StudyBuddy/${b._id}`}>
              ...avatar+text...
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );
}
