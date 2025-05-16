const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Get chat history for a room
router.get('/:room', auth, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ room: req.params.room })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(messages);
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/notifications/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 