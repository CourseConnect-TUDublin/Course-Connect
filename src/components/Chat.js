// src/components/Chat.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Typography,
} from "@mui/material";

let socket;

// initialize socket once
function getSocket() {
  if (!socket) {
    socket = io(); // adjust URL/options if needed
  }
  return socket;
}

export default function Chat({ room, currentUser, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const typingTimeout = useRef(null);
  const isTyping = useRef(false);

  useEffect(() => {
    const sock = getSocket();

    // join room, send join payload
    sock.emit("joinRoom", { room, user: currentUser, userId: currentUserId });

    // receive chat history
    sock.on("history", (history) => {
      setMessages(
        history.map((m) => ({
          user: m.userName,
          message: m.message,
          timestamp: m.timestamp,
        }))
      );
    });

    // new chat messages
    sock.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // online users list update
    sock.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // someone started typing
    sock.on("typing", ({ user }) => {
      setTypingUsers((prev) =>
        prev.includes(user) ? prev : [...prev, user]
      );
    });

    // someone stopped typing
    sock.on("stopTyping", ({ user }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    });

    return () => {
      sock.off("history");
      sock.off("chatMessage");
      sock.off("onlineUsers");
      sock.off("typing");
      sock.off("stopTyping");
    };
  }, [room, currentUser, currentUserId]);

  // auto-scroll on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // handle input changes and typing indicator
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    const sock = getSocket();
    if (!isTyping.current) {
      sock.emit("typing", { room, user: currentUser });
      isTyping.current = true;
    }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      sock.emit("stopTyping", { room, user: currentUser });
      isTyping.current = false;
    }, 1000);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const payload = {
      room,
      user: currentUser,
      userId: currentUserId,
      message: input.trim(),
    };
    getSocket().emit("chatMessage", payload);
    setInput("");
    // immediately stop typing
    if (isTyping.current) {
      getSocket().emit("stopTyping", { room, user: currentUser });
      isTyping.current = false;
      clearTimeout(typingTimeout.current);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" color="textSecondary">
          Online: {onlineUsers.join(", ") || "—"}
        </Typography>
      </Box>
      <Box
        ref={listRef}
        sx={{
          border: "1px solid #ccc",
          borderRadius: 1,
          p: 1,
          height: 300,
          overflowY: "auto",
          mb: 1,
          backgroundColor: "#f9f9f9",
        }}
      >
        <List dense>
          {messages.map((m, idx) => (
            <ListItem key={idx} alignItems="flex-start">
              <ListItemText
                primary={`${m.user} · ${new Date(m.timestamp).toLocaleTimeString()}`}
                secondary={m.message}
              />
            </ListItem>
          ))}
        </List>
        {typingUsers.length > 0 && (
          <Typography variant="caption" color="textSecondary">
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing…
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message…"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
