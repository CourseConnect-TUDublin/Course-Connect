"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Button,
  CircularProgress
} from "@mui/material";

export default function Chat({ room }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef(null);
  const listEndRef = useRef(null);

  // Fetch history
  const load = async () => {
    try {
      const res = await fetch(`/api/chat/${room}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Chat load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Post a new message
  const send = async () => {
    if (!text.trim()) return;
    const body = { senderId: user.id, text };
    try {
      const res = await fetch(`/api/chat/${room}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const msg = await res.json();
      setMessages(msgs => [...msgs, msg]);
      setText("");
    } catch (err) {
      console.error("Chat send error:", err);
    }
  };

  // Polling every 3 seconds
  useEffect(() => {
    load();
    pollingRef.current = setInterval(load, 3000);
    return () => clearInterval(pollingRef.current);
  }, [room]);

  // Scroll to bottom on new messages
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return <CircularProgress size={24} />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {messages.map(m => (
          <ListItem key={m._id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src={m.sender.avatar} alt={m.sender.name} />
            </ListItemAvatar>
            <ListItemText
              primary={m.sender.name}
              secondary={m.text}
            />
          </ListItem>
        ))}
        <div ref={listEndRef} />
      </List>
      <Box
        component="form"
        onSubmit={e => { e.preventDefault(); send(); }}
        sx={{ display: "flex", gap: 1, p: 1 }}
      >
        <TextField
          fullWidth
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message…"
          size="small"
        />
        <Button type="submit" variant="contained" disabled={!text.trim()}>
          Send
        </Button>
      </Box>
    </Box>
  );
}
