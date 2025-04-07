
// Technical and soft skills lists for matching in resumes
export const technicalSkills = [
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

export const softSkills = [
  "leadership", "communication", "teamwork", "problem solving", "critical thinking",
  "adaptability", "creativity", "time management", "collaboration", "presentation",
  "management", "organization", "attention to detail", "analytical", "mentoring",
  "coaching", "project management", "stakeholder management", "decision making",
  "conflict resolution", "negotiation", "emotional intelligence", "strategic thinking",
  "prioritization", "resourcefulness", "self-motivated", "proactive", "customer service",
  "interpersonal", "verbal communication", "written communication", "multitasking",
  "training", "delegation", "accountability", "flexibility", "innovation", "perseverance"
];

// Function to detect skills in resume content
export const detectSkills = (content: string) => {
  console.log("Detecting skills in content of length:", content.length);
  const contentLower = content.toLowerCase();
  
  const foundTechnicalSkills = technicalSkills.filter(skill => 
    contentLower.includes(skill)
  );
  
  const foundSoftSkills = softSkills.filter(skill => 
    contentLower.includes(skill)
  );
  
  console.log("Found technical skills:", foundTechnicalSkills);
  console.log("Found soft skills:", foundSoftSkills);
  
  return {
    foundTechnicalSkills,
    foundSoftSkills
  };
};
