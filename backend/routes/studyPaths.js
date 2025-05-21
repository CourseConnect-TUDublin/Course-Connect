const express = require('express');
const router = express.Router();
const StudyPath = require('../models/StudyPath');

// GET /api/study-paths - Get study paths by course
router.get('/', async (req, res) => {
  try {
    const { courseId } = req.query;
    
    if (!courseId) {
      return res.status(400).json({ 
        error: 'Missing required parameter',
        message: 'courseId is required' 
      });
    }

    const studyPaths = await StudyPath.find({ courseId })
      .select('year semester group') // Only return required fields
      .sort({ year: 1, semester: 1 }); // Sort by year and semester
    
    res.json(studyPaths);
  } catch (error) {
    console.error('Error fetching study paths:', error);
    res.status(500).json({ 
      error: 'Failed to fetch study paths',
      message: error.message 
    });
  }
});

module.exports = router; 