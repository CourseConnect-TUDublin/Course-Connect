const express = require('express');
const router = express.Router();
const Discipline = require('../models/Discipline');

// GET /api/disciplines - Get all disciplines
router.get('/', async (req, res) => {
  try {
    const disciplines = await Discipline.find()
      .select('name color') // Only return name and color fields
      .sort({ name: 1 }); // Sort alphabetically by name
    
    res.json(disciplines);
  } catch (error) {
    console.error('Error fetching disciplines:', error);
    res.status(500).json({ 
      error: 'Failed to fetch disciplines',
      message: error.message 
    });
  }
});

module.exports = router; 