const mongoose = require('mongoose');
require('dotenv').config();
const Discipline = require('../models/Discipline');
const Course = require('../models/Course');
const Module = require('../models/Module');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Seed data
const disciplines = [
  {
    name: 'Computing, IT & Data Analytics',
    color: '#2563eb' // Blue
  },
  {
    name: 'Business & Management',
    color: '#16a34a' // Green
  },
  {
    name: 'Engineering & Technology',
    color: '#dc2626' // Red
  },
  {
    name: 'Mathematics & Statistics',
    color: '#9333ea' // Purple
  }
];

// IT Course Modules (Year 1)
const itModules = [
  {
    name: 'Introduction to Programming',
    code: 'IT101',
    semester: 1,
    year: 1,
    credits: 5,
    isElective: false
  },
  {
    name: 'Computer Architecture',
    code: 'IT102',
    semester: 1,
    year: 1,
    credits: 5,
    isElective: false
  },
  {
    name: 'Mathematics for Computing',
    code: 'IT103',
    semester: 1,
    year: 1,
    credits: 5,
    isElective: false
  },
  {
    name: 'Web Development Fundamentals',
    code: 'IT104',
    semester: 2,
    year: 1,
    credits: 5,
    isElective: false
  },
  {
    name: 'Database Systems',
    code: 'IT105',
    semester: 2,
    year: 1,
    credits: 5,
    isElective: false
  },
  {
    name: 'Professional Skills in IT',
    code: 'IT106',
    semester: 2,
    year: 1,
    credits: 5,
    isElective: false
  }
];

// Sample courses for each discipline
const courses = {
  'Computing, IT & Data Analytics': [
    { name: 'Information Technology', code: 'BSC-IT' },
    { name: 'Computer Science', code: 'BSC-CS' },
    { name: 'Data Science', code: 'BSC-DS' }
  ],
  'Business & Management': [
    { name: 'Business Administration', code: 'BBA' },
    { name: 'International Business', code: 'BSC-IB' }
  ],
  'Engineering & Technology': [
    { name: 'Mechanical Engineering', code: 'BEng-ME' },
    { name: 'Electrical Engineering', code: 'BEng-EE' }
  ],
  'Mathematics & Statistics': [
    { name: 'Applied Mathematics', code: 'BSC-AM' },
    { name: 'Statistics', code: 'BSC-STAT' }
  ]
};

async function seedDatabase() {
  try {
    // Clear existing data
    await Promise.all([
      Discipline.deleteMany({}),
      Course.deleteMany({}),
      Module.deleteMany({})
    ]);

    // Insert disciplines
    const createdDisciplines = await Discipline.insertMany(disciplines);
    console.log('✅ Disciplines created');

    // Create a map of discipline names to their IDs
    const disciplineMap = {};
    createdDisciplines.forEach(disc => {
      disciplineMap[disc.name] = disc._id;
    });

    // Insert courses for each discipline
    for (const [disciplineName, disciplineCourses] of Object.entries(courses)) {
      const disciplineId = disciplineMap[disciplineName];
      const coursesWithDiscipline = disciplineCourses.map(course => ({
        ...course,
        disciplineId
      }));
      
      const createdCourses = await Course.insertMany(coursesWithDiscipline);
      console.log(`✅ Courses created for ${disciplineName}`);

      // If this is the IT course, add the modules
      if (disciplineName === 'Computing, IT & Data Analytics') {
        const itCourse = createdCourses.find(c => c.code === 'BSC-IT');
        if (itCourse) {
          const modulesWithCourse = itModules.map(module => ({
            ...module,
            courseId: itCourse._id
          }));
          await Module.insertMany(modulesWithCourse);
          console.log('✅ IT course modules created');
        }
      }
    }

    console.log('🌱 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 