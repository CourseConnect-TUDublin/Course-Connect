// utils/isOnline.js
export function isOnline(lastActive) {
    if (!lastActive) return false;
    return Date.now() - new Date(lastActive).getTime() < 5 * 60 * 1000; // 5 minutes
  }
  