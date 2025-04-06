
export interface ResumeData {
  fileName: string;
  content: string;
  uploadDate: string;
}

export interface AnalysisResult {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number;
  keywords: string[];
}

// Function to analyze resume content
export const generateAnalysisFromContent = (content: string): AnalysisResult => {
  const contentLower = content.toLowerCase();
  const words = contentLower.split(/\s+/);
  const wordCount = words.length;
  
  // Extract skills from content (simple approach)
  const technicalSkills = [
    "javascript", "typescript", "react", "node", "html", "css", "python", 
    "java", "c#", "php", "sql", "nosql", "mongodb", "aws", "azure", "docker",
    "kubernetes", "git", "agile", "scrum", "rest", "graphql", "redux", "vue",
    "angular", "express", "django", "flask", "spring", "ruby", "rails"
  ];
  
  const softSkills = [
    "leadership", "communication", "teamwork", "problem solving", "critical thinking",
    "adaptability", "creativity", "time management", "collaboration", "presentation",
    "management", "organization", "attention to detail", "analytical"
  ];
  
  const foundTechnicalSkills = technicalSkills.filter(skill => 
    contentLower.includes(skill)
  );
  
  const foundSoftSkills = softSkills.filter(skill => 
    contentLower.includes(skill)
  );
  
  // Calculate score based on content
  let score = 60; // Base score
  
  // Check for quantifiable achievements (numbers)
  const hasNumbers = /\d+%|\d+x|\$\d+|\d+ years|\d+ months|\d+ weeks|\d+ days/i.test(content);
  if (hasNumbers) {
    score += 10;
  }
  
  // Check for action verbs
  const actionVerbs = [
    "achieved", "improved", "trained", "managed", "created", "reduced", 
    "increased", "negotiated", "launched", "developed", "implemented", 
    "designed", "organized", "led", "resolved", "streamlined"
  ];
  
  const hasActionVerbs = actionVerbs.some(verb => contentLower.includes(verb));
  if (hasActionVerbs) {
    score += 5;
  }
  
  // Check for technical skills
  score += Math.min(15, foundTechnicalSkills.length * 3);
  
  // Check for soft skills
  score += Math.min(10, foundSoftSkills.length * 2);
  
  // Check resume length
  if (wordCount < 200) {
    score -= 10; // Too short
  } else if (wordCount > 700) {
    score -= 5; // Too long
  }
  
  // Determine strengths
  const strengths = [];
  
  if (foundTechnicalSkills.length > 0) {
    strengths.push(`Strong technical skills including: ${foundTechnicalSkills.slice(0, 5).join(", ")}`);
  }
  
  if (foundSoftSkills.length > 0) {
    strengths.push(`Good soft skills including: ${foundSoftSkills.slice(0, 3).join(", ")}`);
  }
  
  if (hasNumbers) {
    strengths.push("Quantified achievements with metrics");
  }
  
  if (hasActionVerbs) {
    strengths.push("Uses strong action verbs to describe experiences");
  }
  
  if (contentLower.includes("education") || contentLower.includes("university") || 
      contentLower.includes("college") || contentLower.includes("degree")) {
    strengths.push("Includes educational background");
  }
  
  // Add default strength if needed
  if (strengths.length < 2) {
    strengths.push("Resume provides basic professional information");
  }
  
  // Determine weaknesses
  const weaknesses = [];
  
  if (wordCount < 200) {
    weaknesses.push("Resume is too short and lacks detailed information");
  } else if (wordCount > 700) {
    weaknesses.push("Resume is quite lengthy and could be more concise");
  }
  
  if (foundTechnicalSkills.length < 3) {
    weaknesses.push("Lacks sufficient technical skills or doesn't highlight them clearly");
  }
  
  if (foundSoftSkills.length < 2) {
    weaknesses.push("Could emphasize soft skills more prominently");
  }
  
  if (!hasNumbers) {
    weaknesses.push("Missing quantifiable achievements and metrics");
  }
  
  if (!hasActionVerbs) {
    weaknesses.push("Uses passive language instead of strong action verbs");
  }
  
  // Add default weakness if needed
  if (weaknesses.length < 2) {
    weaknesses.push("Could benefit from more specific examples of accomplishments");
    weaknesses.push("Professional summary could be more tailored to job targets");
  }
  
  // Generate suggestions
  const suggestions = [
    "Add more quantifiable achievements to demonstrate impact",
    "Incorporate industry-specific keywords throughout your resume"
  ];
  
  if (foundTechnicalSkills.length < 5) {
    suggestions.push("Highlight more relevant technical skills");
  }
  
  if (!hasActionVerbs) {
    suggestions.push("Use strong action verbs to begin bullet points");
  }
  
  if (wordCount > 700) {
    suggestions.push("Make your resume more concise by focusing on recent and relevant experiences");
  } else if (wordCount < 200) {
    suggestions.push("Expand your resume with more details about your experience and skills");
  }
  
  // Recommended keywords
  const missingTechnicalSkills = technicalSkills
    .filter(skill => !foundTechnicalSkills.includes(skill))
    .slice(0, 5);
    
  const missingSoftSkills = softSkills
    .filter(skill => !foundSoftSkills.includes(skill))
    .slice(0, 3);
    
  const recommendedKeywords = [...foundTechnicalSkills.slice(0, 3), ...foundSoftSkills.slice(0, 2), 
    ...missingTechnicalSkills.slice(0, 2), ...missingSoftSkills.slice(0, 2)];
  
  // Return analysis result
  return {
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4),
    suggestions: suggestions.slice(0, 5),
    score: Math.min(98, Math.max(50, score)), // Keep score between 50-98
    keywords: recommendedKeywords.slice(0, 8)
  };
};
