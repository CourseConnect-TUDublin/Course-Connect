// src/components/Leaderboard.js

import React, { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/rewards')
      .then(res => res.json())
      .then(res => setData(res.leaderboard));
  }, []);

  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      <ol>
        {data.map(user => (
          <li key={user._id}>
            {user.name} - {user.points} pts (Level {user.level})
          </li>
        ))}
      </ol>
    </div>
  );
}
