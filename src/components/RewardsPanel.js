// src/components/RewardsPanel.js

import React from 'react';

export default function RewardsPanel({ user }) {
  return (
    <div className="rewards-panel">
      <h3>My Rewards</h3>
      <div>Level: {user.level}</div>
      <div>XP: {user.xp}</div>
      <div>Points: {user.points}</div>
      <div>Streak: {user.streak} days</div>
      <div>Badges:
        {user.badges.map(badge => (
          <span key={badge} className="badge">{badge}</span>
        ))}
      </div>
    </div>
  );
}
