// src/services/rewardService.js

import User from "@/models/User";

const REWARD_ACTIONS = {
  task_completed: { points: 10, xp: 10 },
  join_session: { points: 15, xp: 15 },
  daily_login: { points: 5, xp: 5 },
  help_peer: { points: 20, xp: 15 },
  finish_week: { points: 50, xp: 50 }
};

const BADGES = {
  CONSISTENT: { name: "Consistency Champ", condition: (user) => user.streak >= 7 },
  FIRST_TASK: { name: "Getting Started", condition: (user) => user.points >= 10 },
  LEVEL_5: { name: "Level 5 Achiever", condition: (user) => user.level >= 5 }
  // Add more as needed
};

export async function awardPoints(userId, type, taskId = null) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const reward = REWARD_ACTIONS[type];
  if (!reward) throw new Error('Unknown reward type');

  // Update streak (daily logic)
  const now = new Date();
  if (user.lastActivity) {
    const daysDiff = Math.floor((now - user.lastActivity) / (1000 * 60 * 60 * 24));
    user.streak = daysDiff === 1 ? user.streak + 1 : (daysDiff > 1 ? 1 : user.streak);
  } else {
    user.streak = 1;
  }
  user.lastActivity = now;

  // Add points/xp (if fields are missing, default to 0)
  user.points = (user.points || 0) + reward.points;
  user.xp = (user.xp || 0) + reward.xp;
  user.level = user.level || 1;
  user.badges = user.badges || [];

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

export async function getLeaderboard(limit = 10) {
  return await User.find()
    .sort({ points: -1 })
    .limit(limit)
    .select('name points level badges');
}

export { BADGES, REWARD_ACTIONS };
