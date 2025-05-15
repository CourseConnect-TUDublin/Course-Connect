// src/server/socket.js
const { Server } = require('socket.io');
const ChatMessage = require('../models/ChatMessage'); // adjust path as needed

let io;

// Track online users per room: { [room]: Map<socketId, { userId, userName }> }
const roomUsers = {};

function initSockets(server) {
  if (io) return io; // prevent re-initializing

  io = new Server(server, {
    cors: {
      origin: '*', // TODO: restrict to your frontend origin in production
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a room, load history, track user, and notify others
    socket.on('joinRoom', async ({ room, user, userId }) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);

      // Initialize room set if needed
      if (!roomUsers[room]) {
        roomUsers[room] = new Map();
      }
      // Track this socket's user
      roomUsers[room].set(socket.id, { userId, userName: user });

      // Load and emit chat history to this socket
      try {
        const history = await ChatMessage.find({ room })
          .sort('timestamp')
          .limit(100);
        socket.emit('history', history);
      } catch (err) {
        console.error('Error loading chat history:', err);
      }

      // Broadcast join message
      socket.to(room).emit('chatMessage', {
        user: 'System',
        message: `${user} has joined the room.`,
        timestamp: Date.now(),
      });

      // Emit updated online users list to room
      const users = Array.from(roomUsers[room].values()).map(u => u.userName);
      io.to(room).emit('onlineUsers', users);
    });

    // Handle incoming chat messages: broadcast & persist
    socket.on('chatMessage', async ({ room, user, userId, message }) => {
      const payload = { user, message, timestamp: Date.now() };
      io.to(room).emit('chatMessage', payload);

      try {
        await ChatMessage.create({
          room,
          userId,
          userName: user,
          message,
          timestamp: new Date(),
        });
      } catch (err) {
        console.error('Error saving chat message:', err);
      }
    });

    // Handle typing indicators
    socket.on('typing', ({ room, user }) => {
      socket.to(room).emit('typing', { user });
    });
    socket.on('stopTyping', ({ room, user }) => {
      socket.to(room).emit('stopTyping', { user });
    });

    // Handle disconnects: broadcast leave message & update online list
    socket.on('disconnecting', () => {
      for (const room of socket.rooms) {
        if (room === socket.id) continue;

        const userInfo = roomUsers[room]?.get(socket.id);
        // Broadcast leave message
        io.to(room).emit('chatMessage', {
          user: 'System',
          message: `${userInfo?.userName ?? 'A user'} has left the room.`,
          timestamp: Date.now(),
        });

        // Remove from tracking
        roomUsers[room]?.delete(socket.id);
        // Emit updated online users list
        const users = Array.from(roomUsers[room]?.values() || []).map(u => u.userName);
        io.to(room).emit('onlineUsers', users);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = { initSockets };
