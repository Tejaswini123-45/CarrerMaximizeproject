
import { detectSkills } from './skillDetection';

// Map skills to relevant question templates
const technicalQuestionTemplates = [
  "Describe your experience with [skill]. What challenging problems have you solved with it?",
  "How have you used [skill] in a production environment?",
  "What advanced features of [skill] are you familiar with?",
  "Can you explain a complex concept related to [skill] in simple terms?",
  "How do you stay updated with the latest developments in [skill]?"
];

const softSkillQuestionTemplates = [
  "Describe a situation where you demonstrated strong [skill]. What was the outcome?",
  "How do you apply [skill] when working in a team environment?",
  "Tell me about a time when your [skill] helped resolve a conflict",
  "How do you balance [skill] with meeting project deadlines?",
  "Give an example of how you've improved your [skill] over time"
];

const generalQuestionTemplates = [
  "Tell me about a challenging project you worked on and how you overcame obstacles.",
  "How do you approach learning new technologies or methodologies?",
  "Describe a situation where you had to make a difficult decision with limited information.",
  "How do you prioritize tasks when working on multiple projects with competing deadlines?",
  "Tell me about a time when you had to collaborate with a difficult team member.",
  "What steps do you take to ensure quality in your work?",
  "How do you stay current with industry trends and developments?",
  "Describe your communication style when working with non-technical stakeholders.",
  "How have you handled a situation where you made a mistake?",
  "What has been your most significant professional achievement and why?"
];

// Generate interview questions based on resume content
export const generateQuestions = (resumeContent: string, count = 10) => {
  const { foundTechnicalSkills, foundSoftSkills } = detectSkills(resumeContent);
  const questions = [];
  
  // Add technical skill questions
  if (foundTechnicalSkills.length > 0) {
    const availableSkills = [...foundTechnicalSkills];
    
    for (let i = 0; i < Math.min(3, availableSkills.length); i++) {
      const randomSkillIndex = Math.floor(Math.random() * availableSkills.length);
      const skill = availableSkills.splice(randomSkillIndex, 1)[0];
      
      const templateIndex = Math.floor(Math.random() * technicalQuestionTemplates.length);
      const questionTemplate = technicalQuestionTemplates[templateIndex];
      const question = questionTemplate.replace('[skill]', skill);
      
      questions.push({
        id: `tech-${i}-${Date.now()}`,
        text: question,
        category: "Technical"
      });
    }
  }
  
  // Add soft skill questions
  if (foundSoftSkills.length > 0) {
    const availableSkills = [...foundSoftSkills];
    
    for (let i = 0; i < Math.min(2, availableSkills.length); i++) {
      const randomSkillIndex = Math.floor(Math.random() * availableSkills.length);
      const skill = availableSkills.splice(randomSkillIndex, 1)[0];
      
      const templateIndex = Math.floor(Math.random() * softSkillQuestionTemplates.length);
      const questionTemplate = softSkillQuestionTemplates[templateIndex];
      const question = questionTemplate.replace('[skill]', skill);
      
      questions.push({
        id: `soft-${i}-${Date.now()}`,
        text: question,
        category: "Behavioral"
      });
    }
  }
  
  // Fill remaining slots with general questions
  const generalQuestionsNeeded = count - questions.length;
  const shuffledGeneralQuestions = [...generalQuestionTemplates]
    .sort(() => Math.random() - 0.5)
    .slice(0, generalQuestionsNeeded);
  
  shuffledGeneralQuestions.forEach((question, index) => {
    const category = index % 2 === 0 ? "Situational" : "Experience";
    questions.push({
      id: `general-${index}-${Date.now()}`,
      text: question,
      category
    });
  });
  
  return questions;
};
