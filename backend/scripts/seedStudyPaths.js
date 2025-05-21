const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Import models using correct relative paths from scripts directory
const Course = require('../models/Course');
const StudyPath = require('../models/StudyPath');
const Module = require('../models/Module');

// Study Paths configuration
const studyPathsConfig = [
  // Year 1
  { year: 1, semester: 1, group: 'General' },
  { year: 1, semester: 2, group: 'General' },
  // Year 2
  { year: 2, semester: 1, group: 'General' },
  { year: 2, semester: 2, group: 'General' },
  // Year 3
  { year: 3, semester: 1, group: 'General' },
  { year: 3, semester: 2, group: 'A' },
  { year: 3, semester: 2, group: 'B' },
  // Year 4
  { year: 4, semester: 1, group: 'A' },
  { year: 4, semester: 1, group: 'B' },
  { year: 4, semester: 1, group: 'C' },
  { year: 4, semester: 2, group: 'A' },
  { year: 4, semester: 2, group: 'B' },
  { year: 4, semester: 2, group: 'C' }
];

// Modules configuration
const modulesConfig = {
  // Year 1
  1: {
    1: [
      { name: 'Computer Organization and Architecture', code: 'IT101', isElective: false },
      { name: 'Networking 1', code: 'IT102', isElective: false },
      { name: 'Fundamentals of Programming 1', code: 'IT103', isElective: false },
      { name: 'Personal & Professional Development', code: 'IT104', isElective: false },
      { name: 'Cybersecurity Fundamentals', code: 'IT105', isElective: false }
    ],
    2: [
      { name: 'Networking 2', code: 'IT106', isElective: false },
      { name: 'Web Development Fundamentals', code: 'IT107', isElective: false },
      { name: 'Mathematics for Computing', code: 'IT108', isElective: false },
      { name: 'Fundamentals of Programming 2', code: 'IT109', isElective: false },
      { name: 'Operating Systems', code: 'IT110', isElective: false }
    ]
  },
  // Year 2
  2: {
    1: [
      { name: 'Database Fundamentals', code: 'IT201', isElective: false },
      { name: 'Web Development Client-Side', code: 'IT202', isElective: false },
      { name: 'Object-Oriented Programming', code: 'IT203', isElective: false },
      { name: 'IT Math & Data Visualisation', code: 'IT204', isElective: false },
      { name: 'Cloud Fundamentals', code: 'IT205', isElective: false }
    ],
    2: [
      { name: 'Advanced Programming', code: 'IT206', isElective: false },
      { name: 'Advanced Databases and Analytics', code: 'IT207', isElective: false },
      { name: 'Front End Development', code: 'IT208', isElective: false },
      { name: 'Secure Full-stack Web Development', code: 'IT209', isElective: false }
    ]
  },
  // Year 3
  3: {
    1: [
      { name: 'Data Structures & Algorithms', code: 'IT301', isElective: false },
      { name: 'Rich Web Applications and Frameworks', code: 'IT302', isElective: false },
      { name: 'Design Patterns', code: 'IT303', isElective: false },
      { name: 'Applied Data Science', code: 'IT304', isElective: false },
      { name: 'Work Placement Preparation', code: 'IT305', isElective: false }
    ],
    2: [
      { name: 'Work Placement', code: 'IT306', isElective: true },
      { name: 'Professional Group Project', code: 'IT307', isElective: true }
    ]
  },
  // Year 4
  4: {
    1: [
      { name: 'Project (Part 1)', code: 'IT401', isElective: false },
      { name: 'Research Skills', code: 'IT402', isElective: false },
      { name: 'Applied Deep Learning & LLMs', code: 'IT403', isElective: false },
      { name: 'Applied Human Language Technology', code: 'IT404', isElective: true },
      { name: 'Mobile and Ubiquitous Computing', code: 'IT405', isElective: true },
      { name: 'General Purpose GPU Computing', code: 'IT406', isElective: true },
      { name: 'Green Computing', code: 'IT407', isElective: true },
      { name: 'XR Systems Design', code: 'IT408', isElective: true },
      { name: 'Parallel Computing', code: 'IT409', isElective: true },
      { name: 'Advanced Data Science', code: 'IT410', isElective: true },
      { name: 'Advanced Web Dev Group Project', code: 'IT411', isElective: true }
    ],
    2: [
      { name: 'Project (Part 2)', code: 'IT412', isElective: false },
      { name: 'Software Quality & Ethics', code: 'IT413', isElective: false },
      { name: 'IoT Technologies', code: 'IT414', isElective: true },
      { name: 'Bio-Inspired Computing', code: 'IT415', isElective: true },
      { name: 'Computer Vision', code: 'IT416', isElective: true },
      { name: '3D & XR Systems', code: 'IT417', isElective: true },
      { name: 'NLP with Deep Learning', code: 'IT418', isElective: true },
      { name: 'Programming Paradigms', code: 'IT419', isElective: true },
      { name: 'Text Analytics', code: 'IT420', isElective: true },
      { name: 'High Performance Computing', code: 'IT421', isElective: true }
    ]
  }
};

async function seedStudyPaths() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Find the BSC-IT course
    const course = await Course.findOne({ code: 'BSC-IT' });
    if (!course) {
      throw new Error('BSC-IT course not found in database');
    }
    console.log('Found course:', {
      id: course._id,
      name: course.name,
      code: course.code
    });

    // Clear existing data
    await StudyPath.deleteMany({});
    await Module.deleteMany({});
    console.log('Cleared existing study paths and modules');

    // Create study paths with actual course ID
    const studyPaths = await StudyPath.insertMany(
      studyPathsConfig.map(path => ({
        ...path,
        courseId: course._id // Use actual course ID
      }))
    );
    console.log('Created study paths');

    // Create modules and link them to study paths
    const modules = [];
    const existingModules = new Set(); // Track existing module codes

    for (const [year, semesters] of Object.entries(modulesConfig)) {
      for (const [semester, semesterModules] of Object.entries(semesters)) {
        // Find the study path(s) for this year and semester
        const relevantPaths = studyPaths.filter(
          path => path.year === parseInt(year) && path.semester === parseInt(semester)
        );

        // Create modules for each study path
        for (const path of relevantPaths) {
          for (const module of semesterModules) {
            // Skip if module code already exists
            if (existingModules.has(module.code)) {
              console.warn(`⚠️ Skipping duplicate module: ${module.code} - ${module.name}`);
              continue;
            }

            existingModules.add(module.code);
            modules.push({
              ...module,
              courseId: course._id, // Use actual course ID
              studyPathId: path._id,
              year: parseInt(year),
              semester: parseInt(semester),
              group: path.group
            });
          }
        }
      }
    }

    await Module.insertMany(modules);
    console.log('Created modules');

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedStudyPaths(); 