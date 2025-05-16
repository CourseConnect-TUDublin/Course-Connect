const express = require('express');
const router = express.Router();
const TimetableEvent = require('../models/TimetableEvent');
const auth = require('../middleware/auth');

// Get all events for a user
router.get('/', auth, async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = { userId: req.user.userId };
    
    // Add date range filter if provided
    if (start && end) {
      query.startTime = { 
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }

    const events = await TimetableEvent.find(query)
      .sort({ startTime: 1 });
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new event
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, startTime, endTime, recurrence, location } = req.body;
    
    const event = new TimetableEvent({
      userId: req.user.userId,
      title,
      description,
      startTime,
      endTime,
      recurrence,
      location,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an event
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, startTime, endTime, recurrence, location } = req.body;
    
    let event = await TimetableEvent.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    event.recurrence = recurrence || event.recurrence;
    event.location = location || event.location;

    await event.save();
    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await TimetableEvent.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 