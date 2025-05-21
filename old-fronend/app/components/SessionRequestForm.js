// src/components/SessionRequestForm.js
"use client";

import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useSession } from "next-auth/react";

export default function SessionRequestForm({ open, onClose, buddyId }) {
  const { data: session } = useSession();
  const hostId = session?.user?.id;  // real MongoDB _id
  const [datetime, setDatetime] = useState("");

  const handleSubmit = async () => {
    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hostId,
        participantIds: [buddyId],
        datetime
      })
    });
    onClose(true);
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Request Study Session</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, width: 400 }}>
        <TextField
          type="datetime-local"
          label="When"
          InputLabelProps={{ shrink: true }}
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!datetime}>
          Send Request
        </Button>
      </DialogActions>
    </Dialog>
  );
}
