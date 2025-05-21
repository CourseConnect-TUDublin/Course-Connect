"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box, Typography, Avatar, Chip, Grid, CircularProgress, Button
} from '@mui/material';
import SessionRequestForm from '../../../components/SessionRequestForm';

export default function StudyBuddyProfile() {
  const { id } = useParams();
  const [buddy, setBuddy]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [open, setOpen]       = useState(false);

  useEffect(() => {
    fetch(`/api/studybuddies?id=${id}`)
      .then(r => r.json())
      .then(setBuddy)
      .catch(e => setError(e.message))
      .finally(()=>setLoading(false));
  }, [id]);

  if(loading) return <Box sx={{p:3,textAlign:'center'}}><CircularProgress/></Box>;
  if(error)   return <Typography color="error" sx={{p:3}}>{error}</Typography>;
  if(!buddy)  return <Typography sx={{p:3}}>Not found</Typography>;

  return (
    <Box sx={{p:3}}>
      <Box sx={{display:'flex',alignItems:'center',gap:2,mb:4}}>
        <Avatar src={buddy.avatar} sx={{width:80,height:80}}/>
        <Box>
          <Typography variant="h4">{buddy.name}</Typography>
          <Typography color="text.secondary">{(buddy.status||'offline').charAt(0).toUpperCase()+buddy.status.slice(1)}</Typography>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{mb:4}}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Subjects</Typography>
          {buddy.subjects.map(s=> <Chip key={s} label={s} sx={{mr:1,mb:1}}/>)}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Availability</Typography>
          {buddy.availability.map(a=> <Chip key={a} label={a} sx={{mr:1,mb:1}}/>)}
        </Grid>
      </Grid>

      <Button variant="contained" onClick={()=>setOpen(true)}>Request Session</Button>
      <SessionRequestForm
        open={open}
        onClose={did=>setOpen(false)}
        buddyId={buddy._id}
      />
    </Box>
  );
}
