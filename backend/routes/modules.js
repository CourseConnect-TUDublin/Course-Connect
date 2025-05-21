const express = require('express');
const router = express.Router();
const Module = require('../models/Module');

// GET /api/modules
// Query parameters: courseId, year, semester, group
router.get('/', async (req, res) => {
  try {
    const { courseId, year, semester, group } = req.query;

    // Log incoming request parameters
    console.log('Received module request with params:', {
      courseId,
      year,
      semester,
      group
    });

    // Validate required parameters
    if (!courseId || !year || !semester || !group) {
      console.error('Missing required parameters:', { courseId, year, semester, group });
      return res.status(400).json({
        error: 'Missing required parameters: courseId, year, semester, and group are required'
      });
    }

    // Parse numeric parameters
    const parsedYear = parseInt(year);
    const parsedSemester = parseInt(semester);

    // Validate numeric parameters
    if (isNaN(parsedYear) || isNaN(parsedSemester)) {
      console.error('Invalid numeric parameters:', { year, semester });
      return res.status(400).json({
        error: 'Invalid year or semester parameters'
      });
    }

    // Log query parameters
    const query = {
      courseId,
      year: parsedYear,
      semester: parsedSemester,
      group
    };
    console.log('Querying modules with:', query);

    // Find modules matching the criteria
    const modules = await Module.find(query).sort({ code: 1 }); // Sort by module code

    // Log query results
    console.log(`Found ${modules.length} modules for the given criteria`);
    if (modules.length === 0) {
      console.log('No modules found for query:', query);
    } else {
      console.log('First module found:', modules[0]);
    }

    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({
      error: 'Failed to fetch modules',
      message: error.message
    });
  }
});

module.exports = router; 