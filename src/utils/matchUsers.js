// /src/utils/matchUsers.js
function computeMatchScore(userA, userB) {
  let score = 0;
  
  // Subjects: weighted more
  const commonSubjects = userA.subjects.filter(subject => userB.subjects.includes(subject));
  score += commonSubjects.length * 2;
  
  // Availability overlap
  const commonAvailability = userA.availability.filter(time => userB.availability.includes(time));
  score += commonAvailability.length;
  
  // Bonus for same learning style
  if (userA.learningStyle === userB.learningStyle) {
    score += 1;
  }
  
  return score;
}

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
