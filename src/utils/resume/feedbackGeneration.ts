
import { AnalysisResult } from '../types/resumeTypes';
import { detectSkills, technicalSkills, softSkills } from './skillDetection';
import { detectAchievements, actionVerbs } from './achievementDetection';

// Generate strengths, weaknesses, and suggestions based on resume content
export const generateFeedback = (content: string, score: number): Pick<AnalysisResult, 'strengths' | 'weaknesses' | 'suggestions' | 'keywords'> => {
  const contentLower = content.toLowerCase();
  const words = contentLower.split(/\s+/);
  const wordCount = words.length;
  
  // Get skills and achievements
  const { foundTechnicalSkills, foundSoftSkills } = detectSkills(content);
  const { achievementMatches, actionVerbMatches } = detectAchievements(content);
  
  // Check for contact information
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i.test(content);
  const hasPhone = /\b(?:\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}\b/i.test(content);
  
  // Generate strengths
  const strengths = [];
  
  if (foundTechnicalSkills.length > 0) {
    strengths.push(`Strong technical skills including: ${foundTechnicalSkills.slice(0, 5).join(", ")}${foundTechnicalSkills.length > 5 ? ' and more' : ''}`);
  }
  
  if (foundSoftSkills.length > 0) {
    strengths.push(`Good soft skills including: ${foundSoftSkills.slice(0, 3).join(", ")}${foundSoftSkills.length > 3 ? ' and more' : ''}`);
  }
  
  if (achievementMatches > 0) {
    strengths.push("Resume includes quantifiable achievements with measurable results");
  }
  
  if (actionVerbMatches > 3) {
    strengths.push("Uses strong action verbs to describe experiences");
  }
  
  if (wordCount >= 300 && wordCount <= 700) {
    strengths.push("Appropriate resume length with good level of detail");
  }
  
  // If we don't have enough strengths, add a generic one
  if (strengths.length < 2) {
    strengths.push("Resume provides basic professional information");
  }
  
  // Generate weaknesses
  const weaknesses = [];
  
  if (wordCount < 200) {
    weaknesses.push("Resume is too short and lacks necessary detail");
  } else if (wordCount > 800) {
    weaknesses.push("Resume is too lengthy and should be more concise");
  }
  
  if (foundTechnicalSkills.length < 3) {
    weaknesses.push("Limited technical skills mentioned - consider adding more relevant technologies");
  }
  
  if (foundSoftSkills.length < 2) {
    weaknesses.push("Could benefit from highlighting more soft skills");
  }
  
  if (achievementMatches === 0) {
    weaknesses.push("Lacks quantifiable achievements and metrics to demonstrate impact");
  }
  
  if (actionVerbMatches < 3) {
    weaknesses.push("Uses weak language instead of impactful action verbs");
  }
  
  if (!hasEmail && !hasPhone) {
    weaknesses.push("Missing contact information");
  }
  
  // If we don't have enough weaknesses, add generic ones
  if (weaknesses.length < 2) {
    weaknesses.push("Could incorporate more industry-specific terminology");
    weaknesses.push("Professional summary could be more tailored");
  }
  
  // Generate suggestions
  const suggestions = [];
  
  if (achievementMatches < 3) {
    suggestions.push("Add 2-3 quantifiable achievements for each role (e.g., 'Increased sales by 20%')");
  }
  
  if (foundTechnicalSkills.length < 5) {
    const relevantMissingSkills = technicalSkills
      .filter(skill => !foundTechnicalSkills.includes(skill))
      .slice(0, 3);
    suggestions.push(`Consider adding relevant technical skills like ${relevantMissingSkills.join(", ")}`);
  }
  
  if (actionVerbMatches < 5) {
    const suggestedVerbs = actionVerbs
      .filter(verb => !contentLower.includes(verb))
      .slice(0, 3);
    suggestions.push(`Begin bullet points with strong action verbs like ${suggestedVerbs.join(", ")}`);
  }
  
  if (wordCount > 800) {
    suggestions.push("Focus on most recent and relevant experiences; aim for 500-700 words");
  } else if (wordCount < 300) {
    suggestions.push("Expand your experience descriptions with more details about responsibilities and achievements");
  }
  
  if (!hasEmail || !hasPhone) {
    suggestions.push("Add complete contact information including phone, email, and LinkedIn profile");
  }
  
  // Add general suggestions if we don't have enough specific ones
  if (suggestions.length < 3) {
    suggestions.push("Tailor your resume for each application with keywords from the job description");
    suggestions.push("Use a clean, modern format with consistent formatting throughout");
    suggestions.push("Have a colleague or professional review your resume for feedback");
  }
  
  // Generate recommended keywords
  // Start with skills found in the resume
  let recommendedKeywords = [...foundTechnicalSkills.slice(0, 5), ...foundSoftSkills.slice(0, 3)];
  
  // Add missing but relevant skills
  const missingTechnicalSkills = technicalSkills
    .filter(skill => !foundTechnicalSkills.includes(skill))
    .slice(0, 3);
    
  const missingSoftSkills = softSkills
    .filter(skill => !foundSoftSkills.includes(skill))
    .slice(0, 2);
  
  recommendedKeywords = [...recommendedKeywords, ...missingTechnicalSkills, ...missingSoftSkills];
  
  // Ensure we have a good mix but don't go over 10 keywords
  recommendedKeywords = [...new Set(recommendedKeywords)].slice(0, 10);
  
  return {
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4),
    suggestions: suggestions.slice(0, 5),
    keywords: recommendedKeywords
  };
};
