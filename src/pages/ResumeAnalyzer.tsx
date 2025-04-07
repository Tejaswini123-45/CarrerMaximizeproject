
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

    try {
      const parsedResumeData = JSON.parse(storedResumeData);
      console.log("Retrieved resume data with content length:", parsedResumeData.content?.length || 0);
      
      // Verify content is present
      if (!parsedResumeData.content || parsedResumeData.content.trim().length === 0) {
        throw new Error("Resume content is empty");
      }
      
      setResumeData(parsedResumeData);

      // Check if this specific resume has already been analyzed
      const storedAnalysis = localStorage.getItem(`resumeAnalysis_${parsedResumeData.fileName}`);
      if (storedAnalysis) {
        console.log("Using cached analysis");
        setAnalysisResult(JSON.parse(storedAnalysis));
      } else {
        // Clear any previous analysis result when a new resume is loaded
        setAnalysisResult(null);
      }
    } catch (error) {
      console.error("Error processing resume data:", error);
      toast.error("Error with resume data. Please try uploading again.");
      navigate("/resume-upload");
    }
  }, [navigate]);

  const analyzeResume = async () => {
    if (!resumeData || !resumeData.content) {
      toast.error("Cannot analyze: resume content is missing");
      return;
    }
    
    console.log("Starting resume analysis with content length:", resumeData.content.length);
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
      // Add a small delay to let the UI update
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Analyze the resume content
      const result = generateAnalysisFromContent(resumeData.content);
      console.log("Analysis completed successfully, score:", result.score);

      // Save analysis to localStorage
      localStorage.setItem(`resumeAnalysis_${resumeData.fileName}`, JSON.stringify(result));
      
      setAnalysisResult(result);
      toast.success("Resume analysis completed!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze resume. Please try again.");
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
