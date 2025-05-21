// server.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { initSockets } = require('./socket');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const timetableRoutes = require('./routes/timetable');
const chatRoutes = require('./routes/chat');
const testRoutes = require('./routes/test');
const disciplineRoutes = require('./routes/disciplines');
const courseRoutes = require('./routes/courses');
const studyPathRoutes = require('./routes/studyPaths');
const moduleRoutes = require('./routes/modules');

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  process.exit(1); // Exit process with failure
});

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Initialize socket.io
initSockets(server);

// Body parser middleware
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', testRoutes);
app.use('/api/disciplines', disciplineRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/study-paths', studyPathRoutes);
app.use('/api/modules', moduleRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`> Backend server ready on http://localhost:${PORT}`);
}); 