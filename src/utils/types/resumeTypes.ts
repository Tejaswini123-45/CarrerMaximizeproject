
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
