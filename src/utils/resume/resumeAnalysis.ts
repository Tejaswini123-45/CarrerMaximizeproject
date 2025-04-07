
import { ResumeData, AnalysisResult } from '../types/resumeTypes';
import { calculateResumeScore } from './scoreCalculation';
import { generateFeedback } from './feedbackGeneration';

// Main function to analyze resume content
export const generateAnalysisFromContent = (content: string): AnalysisResult => {
  // Calculate score
  const score = calculateResumeScore(content);
  
  // Generate feedback
  const feedback = generateFeedback(content, score);
  
  // Return the complete analysis result
  return {
    score,
    ...feedback
  };
};

// Export the types for use in other components
export type { ResumeData, AnalysisResult };
