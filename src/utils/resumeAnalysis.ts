
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
  
  // Extract skills from content (expanded skills list for better matching)
  const technicalSkills = [
    "javascript", "typescript", "react", "node", "html", "css", "python", 
    "java", "c#", "php", "sql", "nosql", "mongodb", "aws", "azure", "docker",
    "kubernetes", "git", "agile", "scrum", "rest", "graphql", "redux", "vue",
    "angular", "express", "django", "flask", "spring", "ruby", "rails",
    "swift", "kotlin", "flutter", "react native", "android", "ios", "mobile",
    "jquery", "bootstrap", "tailwind", "sass", "less", "webpack", "vite",
    "cypress", "jest", "mocha", "chai", "testing", "ci/cd", "jenkins",
    "aws lambda", "serverless", "microservices", "architecture", "devops",
    "data science", "machine learning", "ai", "tensorflow", "pytorch", "nlp",
    "hadoop", "spark", "kafka", "redis", "elasticsearch", "firebase", "gcp"
  ];
  
  const softSkills = [
    "leadership", "communication", "teamwork", "problem solving", "critical thinking",
    "adaptability", "creativity", "time management", "collaboration", "presentation",
    "management", "organization", "attention to detail", "analytical", "mentoring",
    "coaching", "project management", "stakeholder management", "decision making",
    "conflict resolution", "negotiation", "emotional intelligence", "strategic thinking",
    "prioritization", "resourcefulness", "self-motivated", "proactive", "customer service",
    "interpersonal", "verbal communication", "written communication", "multitasking",
    "training", "delegation", "accountability", "flexibility", "innovation", "perseverance"
  ];
  
  // Find all matches in the resume
  const foundTechnicalSkills = technicalSkills.filter(skill => 
    contentLower.includes(skill)
  );
  
  const foundSoftSkills = softSkills.filter(skill => 
    contentLower.includes(skill)
  );
  
  // Calculate base score
  let score = 60;
  
  // Check for quantifiable achievements
  const achievementPatterns = [
    /\d+%/i,                      // Percentages
    /\d+x/i,                      // Multipliers
    /\$\d+[k|K|m|M]?/i,           // Dollar amounts
    /increased (by )?\d+/i,       // Increases
    /reduced (by )?\d+/i,         // Reductions
    /improved (by )?\d+/i         // Improvements
  ];
  
  const achievementMatches = achievementPatterns.filter(pattern => 
    pattern.test(content)
  ).length;
  
  // Add score based on achievements
  score += Math.min(15, achievementMatches * 3);
  
  // Check for action verbs
  const actionVerbs = [
    "achieved", "improved", "trained", "managed", "created", "reduced", 
    "increased", "negotiated", "launched", "developed", "implemented", 
    "designed", "led", "resolved", "streamlined"
  ];
  
  const actionVerbMatches = actionVerbs.filter(verb => 
    contentLower.includes(verb)
  ).length;
  
  // Add score based on action verbs
  score += Math.min(10, actionVerbMatches * 2);
  
  // Check for technical skills
  score += Math.min(15, foundTechnicalSkills.length * 2);
  
  // Check for soft skills
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
  
  // Generate strengths based on actual content
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
  
  // Generate weaknesses based on actual content
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
  
  // Generate suggestions based on actual content
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
  
  // Recommended keywords - mix of found skills and relevant missing ones
  let recommendedKeywords = [];
  
  // Start with skills found in the resume
  recommendedKeywords = [...foundTechnicalSkills.slice(0, 5), ...foundSoftSkills.slice(0, 3)];
  
  // Add missing but relevant skills
  const missingTechnicalSkills = technicalSkills
    .filter(skill => !foundTechnicalSkills.includes(skill))
    .slice(0, 3);
    
  const missingSoftSkills = softSkills
    .filter(skill => !foundSoftSkills.includes(skill))
    .slice(0, 2);
  
  recommendedKeywords = [...recommendedKeywords, ...missingTechnicalSkills, ...missingSoftSkills];
  
  // Ensure we have a good mix but don't go over 12 keywords
  recommendedKeywords = [...new Set(recommendedKeywords)].slice(0, 10);
  
  // Return analysis result
  return {
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4),
    suggestions: suggestions.slice(0, 5),
    score: Math.min(98, Math.max(50, Math.round(score))), // Keep score between 50-98
    keywords: recommendedKeywords
  };
};
