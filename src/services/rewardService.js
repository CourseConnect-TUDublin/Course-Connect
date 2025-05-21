// src/services/rewardService.js

import User from "@/models/User";

/**
 * Reward actions mapping:
 * - Value: { points, xp }
 */
export const REWARD_ACTIONS = {
  COMPLETE_TASK:    { points: 10, xp: 10 },
  JOIN_SESSION:     { points: 15, xp: 15 },
  DAILY_LOGIN:      { points: 5,  xp: 5  },
  HELP_PEER:        { points: 20, xp: 15 },
  FINISH_WEEK:      { points: 50, xp: 50 },
  FLASHCARD_FLIP:   { points: 3,  xp: 5  },
  CREATE_FLASHCARD: { points: 5,  xp: 5  },
  // Add more as needed
};

/**
 * Badge definitions:
 * - Key: badge id
 * - Value: { name, condition (user => boolean) }
 */
export const BADGES = {
  CONSISTENT:  { name: "Consistency Champ", condition: user => user.streak >= 7 },
  FIRST_TASK:  { name: "Getting Started",   condition: user => user.points >= 10 },
  LEVEL_5:     { name: "Level 5 Achiever",  condition: user => user.level >= 5   },
  // Add more badges here
};

// XP required for each level is LEVEL_UP_XP * current level
const LEVEL_UP_XP = 100;

/**
 * Award points and XP for a user action, update level and badges.
 * @param {String} userId - MongoDB user ObjectId
 * @param {String} actionOrType - Action type (e.g., "COMPLETE_TASK")
 * @param {String} [taskId] -  for task-based rewards
 * @returns {Promise<User>} - Updated user object
 */
export async function awardPoints(userId, actionOrType, taskId = null) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Find action config
  let actionKey = (actionOrType || "").toUpperCase();
  if (!REWARD_ACTIONS[actionKey]) {
    actionKey = Object.keys(REWARD_ACTIONS).find(
      key => key.toLowerCase() === (actionOrType || "").toLowerCase()
    );
  }
  const reward = REWARD_ACTIONS[actionKey];
  if (!reward) throw new Error("Unknown reward action: " + actionOrType);

  // Streak logic: increment if last activity was yesterday, reset if >1 day, set to 1 otherwise
  const now = new Date();
  if (user.lastActivity) {
    const daysDiff = Math.floor((now - user.lastActivity) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) user.streak += 1;
    else if (daysDiff > 1) user.streak = 1;
    // If same day, leave streak unchanged
  } else {
    user.streak = 1;
  }
  user.lastActivity = now;

  // Update points, xp, level, badges
  user.points = (user.points || 0) + reward.points;
  user.xp     = (user.xp     || 0) + reward.xp;
  user.level  = user.level || 1;
  user.badges = user.badges || [];

  // Level-up logic: consume XP and increase level if threshold reached
  while (user.xp >= LEVEL_UP_XP * user.level) {
    user.xp   -= LEVEL_UP_XP * user.level;
    user.level += 1;
  }

  // Badge unlocking: add badge if condition met and not already earned
  for (const key in BADGES) {
    const badge = BADGES[key];
    if (badge.condition(user) && !user.badges.includes(badge.name)) {
      user.badges.push(badge.name);
    }
  }

  await user.save();
  return user;
}

/**
 * Get top users sorted by points (leaderboard).
 * @param {Number} limit - Number of users to return (default: 10)
 * @returns {Promise<Array>} - List of top users
 */
export async function getLeaderboard(limit = 10) {
  return await User.find()
    .sort({ points: -1 })
    .limit(limit)
    .select("name points level badges");
}
