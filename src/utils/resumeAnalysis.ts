
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
  
  // Extract job titles and roles for better role matching
  const jobTitles = [
    "software engineer", "senior", "junior", "lead", "developer", "devops",
    "full stack", "frontend", "backend", "data scientist", "product manager",
    "project manager", "engineering manager", "director", "vp", "cto", "ceo",
    "architect", "designer", "ui", "ux", "qa", "quality assurance", "tester",
    "analyst", "consultant", "specialist", "administrator", "support", "intern",
    "principal", "staff", "engineer", "head of", "chief"
  ];
  
  // Extract industries for better context matching
  const industries = [
    "tech", "finance", "banking", "healthcare", "education", "retail",
    "manufacturing", "entertainment", "media", "advertising", "marketing",
    "government", "nonprofit", "legal", "insurance", "consulting", "telecom",
    "energy", "transportation", "logistics", "hospitality", "real estate",
    "construction", "agriculture", "pharmaceutical", "automotive"
  ];
  
  // Find all matches in the resume
  const foundTechnicalSkills = technicalSkills.filter(skill => 
    contentLower.includes(skill)
  );
  
  const foundSoftSkills = softSkills.filter(skill => 
    contentLower.includes(skill)
  );
  
  const foundJobTitles = jobTitles.filter(title =>
    contentLower.includes(title)
  );
  
  const foundIndustries = industries.filter(industry =>
    contentLower.includes(industry)
  );
  
  // Calculate more nuanced score based on content
  let score = 65; // Slightly higher base score
  
  // Check for quantifiable achievements with more patterns
  const achievementPatterns = [
    /\d+%/i,                      // Percentages (e.g., "increased by 20%")
    /\d+x/i,                      // Multipliers (e.g., "3x improvement")
    /\$\d+[k|K|m|M]?/i,           // Dollar amounts (e.g., "$50K", "$1M")
    /\d+ years?/i,                // Years of experience
    /\d+ months?/i,               // Months of experience
    /increased (by )?\d+/i,       // Increases (e.g., "increased by 15")
    /reduced (by )?\d+/i,         // Reductions (e.g., "reduced by 25")
    /saved \$?\d+[k|K|m|M]?/i,    // Savings (e.g., "saved $30K")
    /generated \$?\d+[k|K|m|M]?/i // Revenue generation
  ];
  
  const achievementMatches = achievementPatterns.filter(pattern => 
    pattern.test(content)
  );
  
  // Add score based on achievements (more achievements = higher score)
  score += Math.min(15, achievementMatches.length * 3);
  
  // Check for action verbs (expanded list)
  const actionVerbs = [
    "achieved", "improved", "trained", "managed", "created", "reduced", 
    "increased", "negotiated", "launched", "developed", "implemented", 
    "designed", "organized", "led", "resolved", "streamlined", "transformed",
    "delivered", "coordinated", "orchestrated", "pioneered", "spearheaded",
    "established", "executed", "generated", "secured", "automated", "overhauled",
    "cultivated", "built", "optimized", "enhanced", "accelerated", "reengineered",
    "revitalized", "supported", "facilitated", "guided", "influenced", "mentored"
  ];
  
  const foundActionVerbs = actionVerbs.filter(verb => contentLower.includes(verb));
  
  // Add score based on action verbs (more verbs = higher score, but diminishing returns)
  score += Math.min(10, foundActionVerbs.length * 1.5);
  
  // Check for technical skills (more technical skills = higher score, but diminishing returns)
  score += Math.min(20, foundTechnicalSkills.length * 2.5);
  
  // Check for soft skills
  score += Math.min(12, foundSoftSkills.length * 2);
  
  // Check for education keywords
  const educationKeywords = ["degree", "bachelor", "master", "phd", "mba", "university", "college", "certification", "certified"];
  const hasEducation = educationKeywords.some(keyword => contentLower.includes(keyword));
  if (hasEducation) {
    score += 5;
  }
  
  // Check resume length (more nuanced assessment)
  if (wordCount < 150) {
    score -= 15; // Severely too short
  } else if (wordCount < 300) {
    score -= 8; // Too short
  } else if (wordCount > 800 && wordCount <= 1000) {
    score -= 5; // Too long
  } else if (wordCount > 1000) {
    score -= 10; // Severely too long
  }
  
  // Check for contact information
  const contactPatterns = [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i, // Email
    /\b(?:\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}\b/i, // Phone
    /linkedin\.com\/in\/[\w-]+/i // LinkedIn
  ];
  
  const hasContactInfo = contactPatterns.some(pattern => pattern.test(content));
  if (hasContactInfo) {
    score += 5;
  } else {
    score -= 5;
  }
  
  // Determine strengths (more personalized based on content)
  const strengths = [];
  
  if (foundTechnicalSkills.length > 0) {
    if (foundTechnicalSkills.length > 5) {
      strengths.push(`Impressive range of technical skills including: ${foundTechnicalSkills.slice(0, 5).join(", ")} and more`);
    } else {
      strengths.push(`Good technical foundations with skills in: ${foundTechnicalSkills.join(", ")}`);
    }
  }
  
  if (foundSoftSkills.length > 0) {
    if (foundSoftSkills.length > 3) {
      strengths.push(`Well-rounded soft skills profile highlighting: ${foundSoftSkills.slice(0, 3).join(", ")} and others`);
    } else {
      strengths.push(`Demonstrates important soft skills: ${foundSoftSkills.join(", ")}`);
    }
  }
  
  if (achievementMatches.length >= 3) {
    strengths.push("Excellent use of metrics to quantify achievements and impact");
  } else if (achievementMatches.length > 0) {
    strengths.push("Includes some quantified achievements with measurable results");
  }
  
  if (foundActionVerbs.length >= 5) {
    strengths.push("Strong action-oriented language demonstrating ownership and initiative");
  } else if (foundActionVerbs.length > 0) {
    strengths.push("Uses action verbs to describe experiences");
  }
  
  if (hasEducation) {
    strengths.push("Includes formal education credentials to support qualifications");
  }
  
  if (wordCount >= 300 && wordCount <= 700) {
    strengths.push("Well-balanced resume length with appropriate level of detail");
  }
  
  if (foundJobTitles.length > 0) {
    strengths.push(`Clear career progression with roles including: ${foundJobTitles.slice(0, 2).join(", ")}`);
  }
  
  // Add default strength if needed
  if (strengths.length < 2) {
    strengths.push("Resume provides basic professional information");
  }
  
  // Determine weaknesses (more personalized based on content)
  const weaknesses = [];
  
  if (wordCount < 200) {
    weaknesses.push("Resume is significantly too short and lacks necessary detail");
  } else if (wordCount < 300) {
    weaknesses.push("Resume would benefit from more comprehensive information");
  } else if (wordCount > 800 && wordCount <= 1000) {
    weaknesses.push("Resume is somewhat lengthy and could be more concise");
  } else if (wordCount > 1000) {
    weaknesses.push("Resume is excessively long and should be streamlined");
  }
  
  if (foundTechnicalSkills.length < 3) {
    weaknesses.push("Technical skills section needs expansion with more relevant technologies");
  }
  
  if (foundSoftSkills.length < 2) {
    weaknesses.push("Could benefit from highlighting more soft skills that employers value");
  }
  
  if (achievementMatches.length === 0) {
    weaknesses.push("Lacks quantifiable achievements and metrics to demonstrate impact");
  } else if (achievementMatches.length < 2) {
    weaknesses.push("Could include more measurable results and achievements");
  }
  
  if (foundActionVerbs.length < 3) {
    weaknesses.push("Uses passive or weak language instead of impactful action verbs");
  }
  
  if (!hasEducation) {
    weaknesses.push("Education section is missing or underdeveloped");
  }
  
  if (!hasContactInfo) {
    weaknesses.push("Missing or incomplete contact information");
  }
  
  // Add default weakness if needed
  if (weaknesses.length < 2) {
    weaknesses.push("Could incorporate more industry-specific terminology and keywords");
    weaknesses.push("Professional summary could be more tailored to target roles");
  }
  
  // Generate more specific suggestions based on actual resume content
  const suggestions = [];
  
  if (achievementMatches.length < 3) {
    suggestions.push("Add 2-3 quantifiable achievements for each role (e.g., 'Increased sales by 20%')");
  }
  
  if (foundTechnicalSkills.length < 5) {
    const relevantMissingSkills = technicalSkills
      .filter(skill => !foundTechnicalSkills.includes(skill))
      .slice(0, 3);
    suggestions.push(`Consider adding relevant technical skills like ${relevantMissingSkills.join(", ")}`);
  }
  
  if (foundActionVerbs.length < 5) {
    const suggestedVerbs = actionVerbs
      .filter(verb => !foundActionVerbs.includes(verb))
      .slice(0, 3);
    suggestions.push(`Begin bullet points with strong action verbs like ${suggestedVerbs.join(", ")}`);
  }
  
  if (wordCount > 800) {
    suggestions.push("Focus on most recent and relevant experiences; limit to last 10-15 years");
  } else if (wordCount < 300) {
    suggestions.push("Expand your experience descriptions with more details about responsibilities and achievements");
  }
  
  if (!hasContactInfo) {
    suggestions.push("Add complete contact information including phone, email, and LinkedIn profile");
  }
  
  if (foundSoftSkills.length < 3) {
    const suggestedSoftSkills = softSkills
      .filter(skill => !foundSoftSkills.includes(skill))
      .slice(0, 3);
    suggestions.push(`Incorporate soft skills like ${suggestedSoftSkills.join(", ")} that align with your target roles`);
  }
  
  // Add general suggestions if we don't have enough specific ones
  if (suggestions.length < 3) {
    suggestions.push("Tailor your resume for each application with keywords from the job description");
    suggestions.push("Consider using a clean, modern format with consistent formatting throughout");
    suggestions.push("Have a colleague or professional review your resume for feedback");
  }
  
  // Recommended keywords - combine found skills with suggested ones in a smarter way
  let recommendedKeywords = [];
  
  // Start with skills found in the resume
  recommendedKeywords = [...foundTechnicalSkills.slice(0, 4), ...foundSoftSkills.slice(0, 2)];
  
  // Add job titles relevant to the experience level
  if (contentLower.includes("senior") || contentLower.includes("lead") || contentLower.includes("manager")) {
    recommendedKeywords.push("leadership", "strategy", "mentoring");
  } else {
    recommendedKeywords.push("collaborative", "detail-oriented", "fast learner");
  }
  
  // Add missing but relevant technical skills
  const missingTechnicalSkills = technicalSkills
    .filter(skill => !foundTechnicalSkills.includes(skill))
    .slice(0, 3);
    
  // Add missing but relevant soft skills
  const missingSoftSkills = softSkills
    .filter(skill => !foundSoftSkills.includes(skill))
    .slice(0, 2);
  
  recommendedKeywords = [...recommendedKeywords, ...missingTechnicalSkills, ...missingSoftSkills];
  
  // Ensure we have a good mix but don't go over 10 keywords
  recommendedKeywords = [...new Set(recommendedKeywords)].slice(0, 10);
  
  // Return analysis result with more personalized insights
  return {
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4),
    suggestions: suggestions.slice(0, 5),
    score: Math.min(98, Math.max(50, Math.round(score))), // Keep score between 50-98
    keywords: recommendedKeywords
  };
};
