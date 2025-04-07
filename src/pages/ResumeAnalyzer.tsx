
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { toast } from "sonner";

import { ResumeData, AnalysisResult } from "@/utils/types/resumeTypes";
import { generateAnalysisFromContent } from "@/utils/resume/resumeAnalysis";
import ResumeDisplay from "@/components/resume/ResumeDisplay";
import AnalysisResults from "@/components/resume/AnalysisResults";

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Get resume data from localStorage
    const storedResumeData = localStorage.getItem("userResume");
    if (!storedResumeData) {
      toast.error("No resume found. Please upload your resume first.");
      navigate("/resume-upload");
      return;
    }

    const parsedResumeData = JSON.parse(storedResumeData);
    setResumeData(parsedResumeData);

    // Check if this specific resume has already been analyzed
    const storedAnalysis = localStorage.getItem(`resumeAnalysis_${parsedResumeData.fileName}`);
    if (storedAnalysis) {
      setAnalysisResult(JSON.parse(storedAnalysis));
    } else {
      // Clear any previous analysis result when a new resume is loaded
      setAnalysisResult(null);
    }
  }, [navigate]);

  const analyzeResume = async () => {
    if (!resumeData) return;

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);

    try {
      // Clear a small delay to let the UI update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Analyze the specific resume content
      const resumeContent = resumeData.content;
      
      // Generate analysis based on actual resume content
      const result = generateAnalysisFromContent(resumeContent);

      // Save analysis to localStorage with a unique key based on the file name
      // This ensures different resumes get different analyses
      localStorage.setItem(`resumeAnalysis_${resumeData.fileName}`, JSON.stringify(result));
      
      setAnalysisResult(result);
      toast.success("Resume analysis completed!");
    } catch (error) {
      toast.error("Failed to analyze resume. Please try again.");
      console.error("Analysis error:", error);
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-career-primary mb-6">Resume Weakness Detector</h1>
        
        {resumeData && (
          <div className="mb-6">
            <ResumeDisplay 
              resumeData={resumeData}
              isAnalyzing={isAnalyzing}
              progress={progress}
              onAnalyze={analyzeResume}
              showAnalyzeButton={!analysisResult}
            />
          </div>
        )}
        
        {analysisResult && <AnalysisResults analysisResult={analysisResult} />}
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalyzer;
