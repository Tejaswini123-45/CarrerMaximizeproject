
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, HelpCircle, MessageSquare, Building2, Upload, Award } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [hasResume, setHasResume] = useState(false);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    // Get user data
    const userString = localStorage.getItem("careerMaxUser");
    if (userString) {
      const user = JSON.parse(userString);
      // Extract name from email (before @)
      if (user.email) {
        const name = user.email.split("@")[0];
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    }

    // Check if user has uploaded a resume
    const resumeData = localStorage.getItem("userResume");
    setHasResume(!!resumeData);

    // Get practice score if available
    const scoreData = localStorage.getItem("practiceScore");
    if (scoreData) {
      setScore(parseInt(scoreData));
    }

    // Calculate progress based on completed modules
    let completedSteps = 0;
    if (!!resumeData) completedSteps++;
    if (localStorage.getItem("resumeAnalyzed")) completedSteps++;
    if (localStorage.getItem("questionsGenerated")) completedSteps++;
    if (scoreData) completedSteps++;
    
    setProgress(Math.round((completedSteps / 4) * 100));
  }, []);

  const modules = [
    {
      title: "Resume Weakness Detector",
      description: "Upload and analyze your resume to identify areas for improvement",
      icon: <FileText className="h-8 w-8 text-career-primary" />,
      path: "/resume-analyzer",
      disabled: !hasResume,
      buttonText: hasResume ? "Analyze Resume" : "Upload Resume First"
    },
    {
      title: "Skill-Based Questions",
      description: "Generate interview questions based on your resume content",
      icon: <HelpCircle className="h-8 w-8 text-career-primary" />,
      path: "/skill-questions",
      disabled: !hasResume,
      buttonText: "Generate Questions"
    },
    {
      title: "Answer Practice",
      description: "Practice answering questions and get AI-powered feedback",
      icon: <MessageSquare className="h-8 w-8 text-career-primary" />,
      path: "/practice-answers",
      disabled: !localStorage.getItem("questionsGenerated"),
      buttonText: "Practice Answers"
    },
    {
      title: "Company-Specific Questions",
      description: "Get interview questions tailored to specific companies and roles",
      icon: <Building2 className="h-8 w-8 text-career-primary" />,
      path: "/company-questions",
      disabled: false,
      buttonText: "Explore Companies"
    }
  ];

  const handleUploadClick = () => {
    navigate("/resume-upload");
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-career-primary">Welcome, {userName}!</h1>
            <p className="text-muted-foreground mt-1">Let's optimize your career journey</p>
          </div>
          {!hasResume && (
            <Button 
              onClick={handleUploadClick}
              className="mt-4 md:mt-0 bg-career-primary hover:bg-career-primary/90"
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Resume
            </Button>
          )}
        </div>

        {/* Progress tracker */}
        <Card className="mb-8 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Your Progress</CardTitle>
            <CardDescription>Complete all steps to maximize your interview readiness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{progress}% Complete</span>
                {score !== null && (
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1 text-career-accent" />
                    <span className="text-sm font-medium">Practice Score: {score}%</span>
                  </div>
                )}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <Card key={index} className="dashboard-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  {module.icon}
                  {module.disabled && module.title !== "Resume Weakness Detector" && (
                    <span className="text-xs text-white bg-career-secondary px-2 py-1 rounded-full">
                      Complete previous steps
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl mt-4">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className={`w-full ${module.disabled ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-career-primary hover:bg-career-primary/90'}`}
                  onClick={() => {
                    if (module.disabled) {
                      if (!hasResume) {
                        toast.info("Please upload your resume first");
                      } else {
                        toast.info("Complete previous steps to unlock this feature");
                      }
                    } else {
                      navigate(module.path);
                    }
                  }}
                  disabled={module.disabled}
                >
                  {module.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
