
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { toast } from "sonner";

import { ResumeData, AnalysisResult, generateAnalysisFromContent } from "@/utils/resumeAnalysis";
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

    setResumeData(JSON.parse(storedResumeData));

    // Check if resume has already been analyzed
    const storedAnalysis = localStorage.getItem("resumeAnalysis");
    if (storedAnalysis) {
      setAnalysisResult(JSON.parse(storedAnalysis));
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
      // In a real app, you would make an API call to analyze the resume
      // For this demo, we'll analyze the content of the resume
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Actually analyze the resume content
      const resumeContent = resumeData.content.toLowerCase();
      
      // Generate analysis based on actual resume content
      const result = generateAnalysisFromContent(resumeContent);

      // Save analysis to localStorage
      localStorage.setItem("resumeAnalysis", JSON.stringify(result));
      localStorage.setItem("resumeAnalyzed", "true");
      
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
