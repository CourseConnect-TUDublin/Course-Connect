"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';

export default function CreateSessionForm({ open, onClose, currentUser }) {
  const [buddies, setBuddies]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [selected, setSelected] = useState([]);
  const [datetime, setDatetime] = useState('');
  const [saving, setSaving]     = useState(false);

  // load available buddies when dialog opens
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);

    fetch('/api/studybuddies')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setBuddies(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [open]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // 1) create the session
      const sessionRes = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostId: currentUser.id,
          participantIds: selected.map(b => b._id),
          datetime
        })
      });
      const newSession = await sessionRes.json();

      // 2) send a SessionRequest to each invited buddy
      await Promise.all(
        selected.map(buddy =>
          fetch('/api/session-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: newSession._id || newSession.id,
              from:      currentUser.id,
              to:        buddy._id
            })
          })
        )
      );

      onClose(true);
    } catch (err) {
      console.error("Error scheduling session + requests:", err);
      setError(err.message || 'Failed to schedule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Schedule Study Session</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, width: 400 }}>
        {loading && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography color="error" sx={{ textAlign: 'center' }}>
            {error}
          </Typography>
        )}
        {!loading && !error && (
          <Autocomplete
            multiple
            options={buddies}
            getOptionLabel={b => b.name}
            onChange={(_, v) => setSelected(v)}
            renderInput={params => <TextField {...params} label="Invite Buddies" />}
          />
        )}
        <TextField
          type="datetime-local"
          label="When"
          InputLabelProps={{ shrink: true }}
          value={datetime}
          onChange={e => setDatetime(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={saving || !datetime || !selected.length}
        >
          {saving ? 'Scheduling…' : 'Schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
