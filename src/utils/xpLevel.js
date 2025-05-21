export function getLevelFromXP(xp) {
    let level = 1;
    let xpRequired = 100;
    let remainingXP = xp ?? 0;
    while (remainingXP >= xpRequired) {
      remainingXP -= xpRequired;
      level++;
      xpRequired = 100 + (level - 1) * 50;
    }
    return level;
  }
  