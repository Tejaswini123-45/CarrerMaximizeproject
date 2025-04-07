
// Patterns to detect quantifiable achievements
export const achievementPatterns = [
  /\d+%/i,                      // Percentages
  /\d+x/i,                      // Multipliers
  /\$\d+[k|K|m|M]?/i,           // Dollar amounts
  /increased (by )?\d+/i,       // Increases
  /reduced (by )?\d+/i,         // Reductions
  /improved (by )?\d+/i         // Improvements
];

// Action verbs that indicate strong resume language
export const actionVerbs = [
  "achieved", "improved", "trained", "managed", "created", "reduced", 
  "increased", "negotiated", "launched", "developed", "implemented", 
  "designed", "led", "resolved", "streamlined"
];

// Function to detect achievements and action verbs
export const detectAchievements = (content: string) => {
  const contentLower = content.toLowerCase();
  
  const achievementMatches = achievementPatterns.filter(pattern => 
    pattern.test(content)
  ).length;
  
  const actionVerbMatches = actionVerbs.filter(verb => 
    contentLower.includes(verb)
  ).length;
  
  return {
    achievementMatches,
    actionVerbMatches
  };
};
