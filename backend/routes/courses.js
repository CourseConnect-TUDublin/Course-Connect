const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// GET /api/courses - Get courses by discipline
router.get('/', async (req, res) => {
  try {
    const { disciplineId } = req.query;
    
    if (!disciplineId) {
      return res.status(400).json({ 
        error: 'Missing required parameter',
        message: 'disciplineId is required' 
      });
    }

    const courses = await Course.find({ disciplineId })
      .select('name code _id') // Only return required fields
      .sort({ name: 1 }); // Sort alphabetically by name
    
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ 
      error: 'Failed to fetch courses',
      message: error.message 
    });
  }
});

module.exports = router; 