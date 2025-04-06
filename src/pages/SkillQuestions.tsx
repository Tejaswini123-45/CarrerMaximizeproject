
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, Save, Sparkles, Check, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
  category: string;
}

const SkillQuestions = () => {
  const navigate = useNavigate();
  const [resumeContent, setResumeContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customCategory, setCustomCategory] = useState("Technical");
  
  useEffect(() => {
    // Get resume content from localStorage
    const resumeData = localStorage.getItem("userResume");
    if (!resumeData) {
      toast.error("No resume found. Please upload your resume first.");
      navigate("/resume-upload");
      return;
    }
    
    const parsedData = JSON.parse(resumeData);
    setResumeContent(parsedData.content);
    
    // Check if questions have already been generated
    const storedQuestions = localStorage.getItem("generatedQuestions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
  }, [navigate]);
  
  const generateQuestions = async () => {
    if (!resumeContent) return;
    
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);
    
    try {
      // In a real app, you would make an API call to generate questions
      // For this demo, we'll simulate with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2500));
      
      // Mock generated questions based on common skills
      const mockQuestions: Question[] = [
        { id: "q1", text: "Describe a challenging project you worked on and how you overcame obstacles.", category: "Experience" },
        { id: "q2", text: "How do you approach learning new technologies or methodologies?", category: "Technical" },
        { id: "q3", text: "Can you provide an example of how you've used data analysis to solve a business problem?", category: "Technical" },
        { id: "q4", text: "Tell me about a time when you had to collaborate with a difficult team member.", category: "Behavioral" },
        { id: "q5", text: "How do you prioritize tasks when working on multiple projects with competing deadlines?", category: "Behavioral" },
        { id: "q6", text: "Explain a situation where you had to make a difficult decision with limited information.", category: "Behavioral" },
        { id: "q7", text: "How would you approach implementing a new system or process that encounters resistance?", category: "Situational" },
        { id: "q8", text: "What steps do you take to ensure quality in your work?", category: "Technical" },
        { id: "q9", text: "How do you stay current with industry trends and developments?", category: "Experience" },
        { id: "q10", text: "Describe your communication style when working with non-technical stakeholders.", category: "Behavioral" }
      ];
      
      setQuestions(mockQuestions);
      
      // Save to localStorage
      localStorage.setItem("generatedQuestions", JSON.stringify(mockQuestions));
      localStorage.setItem("questionsGenerated", "true");
      
      toast.success("Interview questions generated successfully!");
    } catch (error) {
      toast.error("Failed to generate questions. Please try again.");
      console.error("Generation error:", error);
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsGenerating(false);
    }
  };
  
  const addCustomQuestion = () => {
    if (!customQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    const newQuestion: Question = {
      id: `custom-${Date.now()}`,
      text: customQuestion.trim(),
      category: customCategory
    };
    
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    
    // Save to localStorage
    localStorage.setItem("generatedQuestions", JSON.stringify(updatedQuestions));
    
    // Reset form
    setCustomQuestion("");
    setCustomCategory("Technical");
    toast.success("Custom question added");
  };
  
  const deleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    
    // Save to localStorage
    localStorage.setItem("generatedQuestions", JSON.stringify(updatedQuestions));
    toast.success("Question removed");
  };
  
  const saveAndContinue = () => {
    if (questions.length === 0) {
      toast.error("Please generate or add at least one question");
      return;
    }
    
    navigate("/practice-answers");
  };
  
  const categories = ["Technical", "Behavioral", "Experience", "Situational"];
  
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-career-primary mb-6">Skill-Based Question Generator</h1>
        
        <div className="space-y-8">
          {questions.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Generate Interview Questions</CardTitle>
                <CardDescription>
                  We'll analyze your resume to create relevant interview questions tailored to your skills and experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Generating questions...</span>
                      <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                ) : (
                  <Button 
                    className="bg-career-primary hover:bg-career-primary/90"
                    onClick={generateQuestions}
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> Generate Questions
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 animate-slide-up">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Interview Questions</h2>
                <span className="text-sm text-muted-foreground">{questions.length} questions</span>
              </div>
              
              {categories.map(category => {
                const categoryQuestions = questions.filter(q => q.category === category);
                if (categoryQuestions.length === 0) return null;
                
                return (
                  <div key={category} className="space-y-3">
                    <h3 className="text-lg font-medium">{category} Questions</h3>
                    {categoryQuestions.map((question, index) => (
                      <Card key={question.id} className="question-card">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                              <div className="bg-career-primary text-white rounded-full w-6 h-6 flex items-center justify-center mt-0.5">
                                <span className="text-xs">{index + 1}</span>
                              </div>
                              <p>{question.text}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteQuestion(question.id)}
                              className="text-career-danger hover:text-career-danger/90 hover:bg-career-danger/10"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                );
              })}
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Your Own Question</CardTitle>
                  <CardDescription>
                    Add a custom question that you want to practice answering
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Question</Label>
                      <Input
                        id="question"
                        placeholder="Enter your custom interview question"
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <Button
                            key={cat}
                            type="button"
                            variant={customCategory === cat ? "default" : "outline"}
                            className={customCategory === cat ? "bg-career-primary hover:bg-career-primary/90" : ""}
                            onClick={() => setCustomCategory(cat)}
                          >
                            {customCategory === cat && <Check className="mr-1 h-4 w-4" />}
                            {cat}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={addCustomQuestion}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Question
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  className="bg-career-primary hover:bg-career-primary/90"
                  onClick={saveAndContinue}
                >
                  <Save className="mr-2 h-4 w-4" /> Save and Practice Answers
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SkillQuestions;
