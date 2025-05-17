// src/services/rewardService.js

const User = require('../models/User');

const REWARD_ACTIONS = {
  COMPLETE_TASK: { points: 10, xp: 10 },
  JOIN_SESSION: { points: 15, xp: 15 },
  DAILY_LOGIN: { points: 5, xp: 5 },
  HELP_PEER: { points: 20, xp: 15 },
  FINISH_WEEK: { points: 50, xp: 50 }
};

const BADGES = {
  CONSISTENT: { name: "Consistency Champ", condition: (user) => user.streak >= 7 },
  FIRST_TASK: { name: "Getting Started", condition: (user) => user.points >= 10 },
  LEVEL_5: { name: "Level 5 Achiever", condition: (user) => user.level >= 5 }
  // Add more as needed
};

async function awardPoints(userId, action) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const reward = REWARD_ACTIONS[action];
  if (!reward) throw new Error('Unknown action');

  // Update streak (daily logic)
  const now = new Date();
  if (user.lastActivity) {
    const daysDiff = Math.floor((now - user.lastActivity) / (1000 * 60 * 60 * 24));
    user.streak = daysDiff === 1 ? user.streak + 1 : (daysDiff > 1 ? 1 : user.streak);
  } else {
    user.streak = 1;
  }
  user.lastActivity = now;

  user.points += reward.points;
  user.xp += reward.xp;

  // Level up logic
  const LEVEL_UP_XP = 100;
  while (user.xp >= LEVEL_UP_XP * user.level) {
    user.xp -= LEVEL_UP_XP * user.level;
    user.level += 1;
  }

  // Badges check
  for (const key in BADGES) {
    const badge = BADGES[key];
    if (badge.condition(user) && !user.badges.includes(badge.name)) {
      user.badges.push(badge.name);
    }
  }

  await user.save();
  return user;
}

async function getLeaderboard(limit = 10) {
  return await User.find().sort({ points: -1 }).limit(limit).select('name points level badges');
}

module.exports = {
  awardPoints,
  getLeaderboard,
  BADGES,
  REWARD_ACTIONS,
};
