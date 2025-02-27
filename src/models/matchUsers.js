// utils/matchUsers.js
/**
 * Computes a matching score between two users.
 * Higher score means a better match.
 */
function computeMatchScore(userA, userB) {
    let score = 0;
  
    // Calculate subject overlap
    const commonSubjects = userA.subjects.filter(subject => userB.subjects.includes(subject));
    score += commonSubjects.length;
  
    // Calculate availability overlap
    const commonAvailability = userA.availability.filter(time => userB.availability.includes(time));
    score += commonAvailability.length;
  
    // Reward if learning style is the same
    if (userA.learningStyle === userB.learningStyle) {
      score += 1;
    }
  
    return score;
  }
  
  /**
   * Returns a list of potential matches sorted by match score.
   */
  function findMatches(currentUser, allUsers) {
    return allUsers
      .filter(user => user._id.toString() !== currentUser._id.toString())
      .map(user => ({
        user,
        score: computeMatchScore(currentUser, user)
      }))
      .sort((a, b) => b.score - a.score);
  }
  
  module.exports = { computeMatchScore, findMatches };
  