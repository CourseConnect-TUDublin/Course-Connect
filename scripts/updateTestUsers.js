// scripts/updateTestUsers.js
const mongoose = require('mongoose');
const User = require('../src/models/User'); // adjust the path if needed

require('dotenv').config({ path: '.env.local' }); // Make sure you're loading the correct env file

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    updateTestUsers();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

async function updateTestUsers() {
  try {
    await User.updateOne(
      { email: 'dylan@example.com' },
      {
        $set: {
          name: 'dylan mugo',
          subjects: ['Math', 'Science'],
          availability: ['Monday Morning', 'Wednesday Afternoon'],
          learningStyle: 'reading'
        }
      },
      { upsert: true }
    );
    await User.updateOne(
      { email: 'ian@example.com' },
      {
        $set: {
          name: 'Ian',
          subjects: ['History', 'Literature'],
          availability: ['Tuesday Evening'],
          learningStyle: 'reading'
        }
      },
      { upsert: true }
    );
    console.log('Test users updated');
  } catch (error) {
    console.error('Error updating test users:', error);
  } finally {
    mongoose.disconnect();
  }
}
