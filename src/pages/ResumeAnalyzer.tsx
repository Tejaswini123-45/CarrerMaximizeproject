
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ResumeData {
  fileName: string;
  content: string;
  uploadDate: string;
}

interface AnalysisResult {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number;
  keywords: string[];
}

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
      // For this demo, we'll simulate the analysis with a timeout and mock data
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock analysis result
      const mockResult: AnalysisResult = {
        strengths: [
          "Strong technical skills in relevant technologies",
          "Clear presentation of work experience",
          "Quantified achievements with metrics",
          "Good education background relevant to the field"
        ],
        weaknesses: [
          "Lacks specific examples of problem-solving abilities",
          "Professional summary could be more tailored to job targets",
          "Some job descriptions focus on responsibilities rather than achievements",
          "Missing keywords that are commonly found in job descriptions"
        ],
        suggestions: [
          "Add more quantifiable achievements to demonstrate impact",
          "Incorporate industry-specific keywords throughout your resume",
          "Reframe job descriptions to focus on accomplishments rather than duties",
          "Include a more targeted professional summary that aligns with desired roles",
          "Add a skills section that clearly highlights technical competencies"
        ],
        score: 72,
        keywords: [
          "leadership", "project management", "cross-functional", "analytical", 
          "problem-solving", "communication", "team collaboration"
        ]
      };

      // Save analysis to localStorage
      localStorage.setItem("resumeAnalysis", JSON.stringify(mockResult));
      localStorage.setItem("resumeAnalyzed", "true");
      
      setAnalysisResult(mockResult);
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Resume</CardTitle>
                <CardDescription>
                  Uploaded on {new Date(resumeData.uploadDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="bg-career-primary/10 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-career-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{resumeData.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {resumeData.content.length > 500 
                        ? `${resumeData.content.substring(0, 500)}...` 
                        : resumeData.content}
                    </p>
                  </div>
                </div>
                
                {!analysisResult && (
                  <Button
                    className="mt-4 bg-career-primary hover:bg-career-primary/90"
                    onClick={analyzeResume}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Resume...
                      </span>
                    ) : (
                      <>Analyze Resume</>
                    )}
                  </Button>
                )}
                
                {isAnalyzing && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Analyzing your resume...</span>
                      <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        
        {analysisResult && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Analysis Results</h2>
              <div className="flex items-center bg-career-accent/10 text-career-accent px-3 py-1 rounded-full">
                <span className="font-bold mr-1">{analysisResult.score}</span>
                <span className="text-sm">/100</span>
              </div>
            </div>
            
            <Alert className={analysisResult.score >= 80 ? "border-career-accent" : "border-career-warning"}>
              <div className="flex items-start">
                {analysisResult.score >= 80 ? (
                  <CheckCircle2 className="h-5 w-5 text-career-accent mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-career-warning mr-2" />
                )}
                <div>
                  <AlertTitle>
                    {analysisResult.score >= 80 
                      ? "Good job! Your resume is looking strong." 
                      : "Your resume needs some improvements."}
                  </AlertTitle>
                  <AlertDescription>
                    {analysisResult.score >= 80 
                      ? "Consider making a few refinements to perfect it." 
                      : "Follow the suggestions below to strengthen your resume."}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
            
            <Tabs defaultValue="weaknesses">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
                <TabsTrigger value="strengths">Strengths</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="weaknesses" className="space-y-4">
                {analysisResult.weaknesses.map((weakness, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-career-warning mr-3 mt-0.5" />
                        <p>{weakness}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="strengths" className="space-y-4">
                {analysisResult.strengths.map((strength, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-career-accent mr-3 mt-0.5" />
                        <p>{strength}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="suggestions" className="space-y-4">
                {analysisResult.suggestions.map((suggestion, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="bg-career-primary text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs">{index + 1}</span>
                        </div>
                        <p>{suggestion}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Phrases to Include</CardTitle>
                <CardDescription>
                  These keywords can strengthen your resume and help it pass ATS systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="bg-career-primary/10 text-career-primary px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                className="bg-career-primary hover:bg-career-primary/90"
                onClick={() => navigate("/skill-questions")}
              >
                Next: Generate Interview Questions
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalyzer;
