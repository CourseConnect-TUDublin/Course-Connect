"use client";

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Box, TextField, Button, Typography } from '@mui/material';

// Connect to the Socket.IO server (adjust settings if needed)
const socket = io();

const Chat = ({ room, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    console.log("Joining room:", room);
    socket.emit('joinRoom', room);

    socket.on('message', (data) => {
      console.log("Received message:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('message');
    };
  }, [room]);

  const sendMessage = () => {
    if (input.trim() !== '') {
      console.log("Sending message:", input);
      const messageData = {
        room,
        sender: currentUser,
        message: input,
      };
      socket.emit('chatMessage', messageData);
      setInput('');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Chat Room
      </Typography>
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: 1,
          p: 1,
          height: 300,
          overflowY: 'auto',
          mb: 2,
          backgroundColor: '#f9f9f9'
        }}
      >
        {messages.map((msg, idx) => (
          <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
            <strong>{msg.sender}:</strong> {msg.message}
          </Typography>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
