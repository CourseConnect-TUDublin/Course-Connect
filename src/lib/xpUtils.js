export function getLevelFromXP(xp) {
    let level = 1;
    let xpRequired = 100;
  
    while (xp >= xpRequired) {
      level++;
      xp -= xpRequired;
      xpRequired = 100 + (level - 1) * 50;
    }
  
    return { level, xpToNext: xpRequired, xpIntoLevel: xp };
  }
  
  export function getXPProgress(xp) {
    const { level, xpToNext, xpIntoLevel } = getLevelFromXP(xp);
    const percent = Math.floor((xpIntoLevel / xpToNext) * 100);
    return { level, percent, xpIntoLevel, xpToNext };
  }
  