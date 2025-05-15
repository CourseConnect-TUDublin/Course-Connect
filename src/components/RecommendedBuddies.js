"use client";

import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Badge,
  ListItemText,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { useSession } from 'next-auth/react';

export default function RecommendedBuddies() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [allBuddies, setAllBuddies]       = useState([]);
  const [me,          setMe]              = useState(null);
  const [recommended, setRecommended]     = useState([]);
  const [loading,     setLoading]         = useState(true);
  const [error,       setError]           = useState(null);

  // 1) Load my full record + all buddies in parallel
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/studybuddies?id=${userId}`).then(r => r.json()),
      fetch('/api/studybuddies').then(r => r.json())
    ])
      .then(([meData, buddiesData]) => {
        setMe(meData);
        setAllBuddies(buddiesData.filter(b => b._id !== userId));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  // 2) Compute recommended when data is ready
  useEffect(() => {
    if (!me || !allBuddies.length) return;
    const mySubjects = new Set(me.subjects || []);
    const recs = allBuddies
      .map(b => ({
        ...b,
        common: (b.subjects || []).filter(s => mySubjects.has(s)).length
      }))
      .filter(b => b.common > 0)         // at least one shared subject
      .sort((a, b) => b.common - a.common) // most in common first
      .slice(0, 5);                      // limit to top 5
    setRecommended(recs);
  }, [me, allBuddies]);

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: 'center' }}>
        Failed to load recommendations: {error}
      </Typography>
    );
  }
  if (!recommended.length) {
    return <Typography>No recommended buddies right now.</Typography>;
  }

  return (
    <List>
      {recommended.map(({ _id, name, avatar, status, common }) => {
        const stat = typeof status === 'string' ? status : 'offline';
        const badgeColor = {
          online:  'success',
          offline: 'default',
          busy:    'warning'
        }[stat] || 'default';
        return (
          <ListItem key={_id} divider>
            <ListItemAvatar>
              <Badge
                overlap="circular"
                badgeContent=" "
                variant="dot"
                color={badgeColor}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Avatar src={avatar} alt={name} />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={name}
              secondary={`Shared subjects: ${common}`}
            />
          </ListItem>
        );
      })}
    </List>
  );
}
