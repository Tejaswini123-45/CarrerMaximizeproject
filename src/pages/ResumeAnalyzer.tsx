
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

  // Function to analyze resume content
  const generateAnalysisFromContent = (content: string): AnalysisResult => {
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
    
    // Limit the total number of items
    return {
      strengths: strengths.slice(0, 4),
      weaknesses: weaknesses.slice(0, 4),
      suggestions: suggestions.slice(0, 5),
      score: Math.min(98, Math.max(50, score)), // Keep score between 50-98
      keywords: recommendedKeywords.slice(0, 8)
    };
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
