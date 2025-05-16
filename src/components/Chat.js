// src/components/Chat.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  useTheme,
  Avatar,
  Stack
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

let socket;
function getSocket() {
  if (!socket) {
    socket = io(); // adjust URL/options if needed
  }
  return socket;
}

export default function Chat({ room, currentUser, currentUserId }) {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const isTyping = useRef(false);
  const typingTimeout = useRef(null);

  useEffect(() => {
    const sock = getSocket();
    sock.emit("joinRoom", { room, user: currentUser, userId: currentUserId });

    sock.on("history", (history) => {
      setMessages(
        history.map((m) => ({
          user: m.userName,
          message: m.message,
          timestamp: m.timestamp,
          userId: m.userId.toString(),
        }))
      );
    });

    sock.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    sock.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    sock.on("typing", ({ user }) => {
      setTypingUsers((prev) =>
        prev.includes(user) ? prev : [...prev, user]
      );
    });

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

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

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
    const text = input.trim();
    if (!text) return;
    const payload = {
      room,
      user: currentUser,
      userId: currentUserId,
      message: text,
    };
    getSocket().emit("chatMessage", payload);
    setInput("");
    if (isTyping.current) {
      getSocket().emit("stopTyping", { room, user: currentUser });
      isTyping.current = false;
      clearTimeout(typingTimeout.current);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      {/* Messages List */}
      <Box
        ref={listRef}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          backgroundColor: theme.palette.background.default,
        }}
      >
        {messages.map((m, i) => {
          const isSelf = m.userId === currentUserId;
          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: isSelf ? "flex-end" : "flex-start",
                mb: 1.5,
              }}
            >
              <Stack direction={isSelf ? "row-reverse" : "row"} spacing={1} alignItems="center">
                <Avatar sx={{ width: 24, height: 24 }}>
                  {m.user.charAt(0).toUpperCase()}
                </Avatar>
                <Box
                  sx={{
                    maxWidth: "70%",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: isSelf
                      ? theme.palette.primary.main
                      : theme.palette.grey[200],
                    color: isSelf
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                  }}
                >
                  <Typography variant="body2">{m.message}</Typography>
                </Box>
              </Stack>
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  color: theme.palette.text.secondary,
                }}
              >
                {m.user} ·{" "}
                {new Date(m.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          );
        })}
        {typingUsers.length > 0 && (
          <Typography variant="caption" color="textSecondary">
            {typingUsers.join(", ")}{" "}
            {typingUsers.length === 1 ? "is" : "are"} typing…
          </Typography>
        )}
      </Box>

      {/* Input Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message…"
          variant="outlined"
          size="small"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          sx={{ mr: 1, bgcolor: theme.palette.background.paper, borderRadius: 1 }}
        />
        <IconButton
          color="primary"
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
