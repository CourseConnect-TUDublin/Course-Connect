// src/services/rewardService.js

import User from "@/models/User";

// All action keys are UPPER_SNAKE_CASE for consistency.
// Add new reward actions here as your app evolves!
export const REWARD_ACTIONS = {
  COMPLETE_TASK:   { points: 10, xp: 10 },
  JOIN_SESSION:    { points: 15, xp: 15 },
  DAILY_LOGIN:     { points: 5,  xp: 5  },
  HELP_PEER:       { points: 20, xp: 15 },
  FINISH_WEEK:     { points: 50, xp: 50 },
  FLASHCARD_FLIP:  { points: 3,  xp: 5  },
  CREATE_FLASHCARD:{ points: 5,  xp: 5  }, // For flashcard creation reward
  // Add more actions here!
};

// Badges with clear conditions for unlocking
export const BADGES = {
  CONSISTENT:  { name: "Consistency Champ", condition: user => user.streak >= 7 },
  FIRST_TASK:  { name: "Getting Started",   condition: user => user.points >= 10 },
  LEVEL_5:     { name: "Level 5 Achiever",  condition: user => user.level >= 5   },
  // Add more badges here!
};

/**
 * Awards points/xp and checks for badge unlocks.
 * Accepts `actionOrType` to support both new/legacy API clients.
 * Supports both UPPER_SNAKE_CASE and camelCase action names.
 *
 * @param {String} userId      - MongoDB user ObjectId
 * @param {String} actionOrType- Reward action type (e.g. "COMPLETE_TASK", "FLASHCARD_FLIP")
 * @param {String} [taskId]    - Optional: for task-based rewards
 * @returns {Promise<User>}    - Updated user object
 */
export async function awardPoints(userId, actionOrType, taskId = null) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Normalize action key (support both API formats)
  let actionKey = (actionOrType || "").toUpperCase();
  if (!REWARD_ACTIONS[actionKey]) {
    // Fallback for camelCase or legacy keys
    actionKey = Object.keys(REWARD_ACTIONS).find(
      key => key.toLowerCase() === (actionOrType || "").toLowerCase()
    );
  }
  const reward = REWARD_ACTIONS[actionKey];
  if (!reward) throw new Error("Unknown reward action: " + actionOrType);

  // Update login/activity streak
  const now = new Date();
  if (user.lastActivity) {
    const daysDiff = Math.floor((now - user.lastActivity) / (1000 * 60 * 60 * 24));
    user.streak = daysDiff === 1 ? user.streak + 1 : (daysDiff > 1 ? 1 : user.streak);
  } else {
    user.streak = 1;
  }
  user.lastActivity = now;

  // Add points and XP (default to 0 if missing)
  user.points = (user.points || 0) + reward.points;
  user.xp = (user.xp || 0) + reward.xp;
  user.level = user.level || 1;
  user.badges = user.badges || [];

  // Level up: each level is harder (level * 100 XP)
  const LEVEL_UP_XP = 100;
  while (user.xp >= LEVEL_UP_XP * user.level) {
    user.xp -= LEVEL_UP_XP * user.level;
    user.level += 1;
  }

  // Badge unlocking
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
 * Get leaderboard (top users by points)
 * @param {Number} limit - Max users to return (default: 10)
 * @returns {Promise<Array>}
 */
export async function getLeaderboard(limit = 10) {
  return await User.find()
    .sort({ points: -1 })
    .limit(limit)
    .select("name points level badges");
}
