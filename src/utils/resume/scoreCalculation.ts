import { detectSkills } from './skillDetection';
import { detectAchievements } from './achievementDetection';

// Calculate the resume score based on various factors
export const calculateResumeScore = (content: string) => {
  const contentLower = content.toLowerCase();
  const words = contentLower.split(/\s+/);
  const wordCount = words.length;
  
  // Start with base score
  let score = 60;
  
  // Get skills and achievements
  const { foundTechnicalSkills, foundSoftSkills } = detectSkills(content);
  const { achievementMatches, actionVerbMatches } = detectAchievements(content);
  
  // Add score based on achievements
  score += Math.min(15, achievementMatches * 3);
  
  // Add score based on action verbs
  score += Math.min(10, actionVerbMatches * 2);
  
  // Add score based on technical skills
  score += Math.min(15, foundTechnicalSkills.length * 2);
  
  // Add score based on soft skills
  score += Math.min(10, foundSoftSkills.length * 2);
  
  // Check resume length - too short or too long affects score
  if (wordCount < 200) {
    score -= 10;
  } else if (wordCount > 800) {
    score -= 5;
  }
  
  // Check for contact information
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i.test(content);
  const hasPhone = /\b(?:\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}\b/i.test(content);
  
  if (hasEmail && hasPhone) {
    score += 5;
  } else if (!hasEmail && !hasPhone) {
    score -= 5;
  }
  
  // Keep score between 50-98
  return Math.min(98, Math.max(50, Math.round(score)));
};
