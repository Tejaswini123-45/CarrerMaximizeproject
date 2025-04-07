
import { ResumeData, AnalysisResult } from '../types/resumeTypes';
import { calculateResumeScore } from './scoreCalculation';
import { generateFeedback } from './feedbackGeneration';

// Main function to analyze resume content
export const generateAnalysisFromContent = (content: string): AnalysisResult => {
  console.log("Starting resume analysis with content length:", content.length);
  
  if (!content || content.trim().length === 0) {
    console.error("Error: Resume content is empty");
    return {
      score: 50,
      strengths: ["Resume was uploaded successfully"],
      weaknesses: ["Cannot analyze empty content", "Please ensure your resume text is readable"],
      suggestions: ["Try uploading your resume in a different format", "Make sure the text in your resume is selectable/extractable"],
      keywords: []
    };
  }
  
  // Calculate score
  const score = calculateResumeScore(content);
  console.log("Calculated score:", score);
  
  // Generate feedback
  const feedback = generateFeedback(content, score);
  console.log("Generated feedback with", 
    feedback.strengths.length, "strengths,", 
    feedback.weaknesses.length, "weaknesses");
  
  // Return the complete analysis result
  return {
    score,
    ...feedback
  };
};

// Export the types for use in other components
export type { ResumeData, AnalysisResult };
