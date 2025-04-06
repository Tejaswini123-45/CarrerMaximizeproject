
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThumbsUp, ThumbsDown, AlertCircle, CheckCircle2, MessageSquare, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

// Define types
interface Question {
  id: string;
  text: string;
  category: string;
}

interface AnswerFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

interface AnsweredQuestion {
  questionId: string;
  answer: string;
  feedback: AnswerFeedback | null;
}

const PracticeAnswers = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<AnswerFeedback | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  useEffect(() => {
    // Check if questions have been generated
    const storedQuestions = localStorage.getItem("generatedQuestions");
    if (!storedQuestions) {
      toast.error("No questions found. Please generate questions first.");
      navigate("/skill-questions");
      return;
    }

    setQuestions(JSON.parse(storedQuestions));

    // Check if there are already saved answers
    const savedAnswers = localStorage.getItem("answeredQuestions");
    if (savedAnswers) {
      setAnsweredQuestions(JSON.parse(savedAnswers));
    }

    // Check if there's a practice score
    const savedScore = localStorage.getItem("practiceScore");
    if (savedScore) {
      setOverallScore(parseInt(savedScore));
    }
  }, [navigate]);

  const currentQuestion = questions[currentQuestionIndex];
  
  // Check if the current question has been answered
  const findAnsweredQuestion = () => {
    if (!currentQuestion) return null;
    return answeredQuestions.find(q => q.questionId === currentQuestion.id);
  };
  
  const answeredQuestion = findAnsweredQuestion();

  const evaluateAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer before submitting");
      return;
    }
    
    setIsEvaluating(true);
    
    try {
      // In a real app, you would make an API call to evaluate the answer
      // For this demo, we'll simulate with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Generate mock feedback
      const mockFeedback: AnswerFeedback = {
        score: Math.floor(Math.random() * 31) + 70, // Random score between 70-100
        strengths: [
          "Good articulation of your experience",
          "Provided specific examples to support your points",
          "Demonstrated problem-solving skills"
        ],
        improvements: [
          "Could be more concise in some areas",
          "Add more quantifiable results when possible",
          "More emphasis on what you learned from the experience"
        ],
        suggestions: [
          "Use the STAR method (Situation, Task, Action, Result) more explicitly",
          "Highlight your unique contributions more clearly",
          "Connect your answer more directly to the role you're targeting"
        ]
      };
      
      setCurrentFeedback(mockFeedback);
      setFeedbackVisible(true);
      
      // Save the answered question
      const updatedAnsweredQuestions = [...answeredQuestions];
      const existingIndex = updatedAnsweredQuestions.findIndex(
        q => q.questionId === currentQuestion.id
      );
      
      if (existingIndex >= 0) {
        updatedAnsweredQuestions[existingIndex] = {
          questionId: currentQuestion.id,
          answer,
          feedback: mockFeedback
        };
      } else {
        updatedAnsweredQuestions.push({
          questionId: currentQuestion.id,
          answer,
          feedback: mockFeedback
        });
      }
      
      setAnsweredQuestions(updatedAnsweredQuestions);
      localStorage.setItem("answeredQuestions", JSON.stringify(updatedAnsweredQuestions));
      
      // Update overall score
      const answeredWithFeedback = updatedAnsweredQuestions.filter(q => q.feedback);
      if (answeredWithFeedback.length > 0) {
        const totalScore = answeredWithFeedback.reduce(
          (sum, q) => sum + (q.feedback?.score || 0), 
          0
        );
        const avgScore = Math.round(totalScore / answeredWithFeedback.length);
        setOverallScore(avgScore);
        localStorage.setItem("practiceScore", avgScore.toString());
      }
      
      toast.success("Answer evaluated successfully!");
    } catch (error) {
      toast.error("Failed to evaluate answer. Please try again.");
      console.error("Evaluation error:", error);
    } finally {
      setIsEvaluating(false);
    }
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer("");
      setFeedbackVisible(false);
      setCurrentFeedback(null);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswer("");
      setFeedbackVisible(false);
      setCurrentFeedback(null);
    }
  };
  
  const resetPractice = () => {
    localStorage.removeItem("answeredQuestions");
    localStorage.removeItem("practiceScore");
    setAnsweredQuestions([]);
    setOverallScore(null);
    setCurrentQuestionIndex(0);
    setAnswer("");
    setFeedbackVisible(false);
    setCurrentFeedback(null);
    toast.success("Practice session reset successfully");
  };
  
  const scoreColor = (score: number) => {
    if (score >= 90) return "text-career-accent";
    if (score >= 80) return "text-career-primary";
    if (score >= 70) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-career-danger";
  };
  
  useEffect(() => {
    // Load saved answer when changing questions
    const previouslyAnswered = findAnsweredQuestion();
    if (previouslyAnswered) {
      setAnswer(previouslyAnswered.answer);
      if (previouslyAnswered.feedback) {
        setCurrentFeedback(previouslyAnswered.feedback);
      }
    } else {
      setAnswer("");
      setCurrentFeedback(null);
    }
    setFeedbackVisible(!!previouslyAnswered?.feedback);
  }, [currentQuestionIndex]);
  
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-career-primary mb-1">Practice Answers</h1>
            <p className="text-muted-foreground">
              Practice answering interview questions and get AI feedback
            </p>
          </div>
          {overallScore !== null && (
            <div className="mt-2 md:mt-0 bg-career-primary/10 p-2 px-4 rounded-full">
              <div className="flex items-center">
                <span className="font-medium mr-2">Overall Score:</span>
                <span className={`font-bold text-lg ${scoreColor(overallScore)}`}>
                  {overallScore}%
                </span>
              </div>
            </div>
          )}
        </div>
        
        {questions.length > 0 && currentQuestion ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </div>
            
            <Progress 
              value={(currentQuestionIndex + 1) / questions.length * 100} 
              className="h-2"
            />
            
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="px-2 py-1 rounded-full text-xs text-white bg-career-primary inline-block mb-2">
                      {currentQuestion.category}
                    </div>
                    <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
                  </div>
                  {answeredQuestion?.feedback && (
                    <div className={`px-2 py-1 rounded-full text-sm font-bold ${scoreColor(answeredQuestion.feedback.score)}`}>
                      Score: {answeredQuestion.feedback.score}%
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your answer here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="min-h-[150px]"
                    disabled={isEvaluating}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      className="bg-career-primary hover:bg-career-primary/90"
                      onClick={evaluateAnswer}
                      disabled={isEvaluating || !answer.trim()}
                    >
                      {isEvaluating ? 
                        "Evaluating..." :
                        answeredQuestion?.feedback ? "Re-evaluate Answer" : "Submit Answer"
                      }
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {feedbackVisible && currentFeedback && (
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-xl">AI Feedback</CardTitle>
                  <CardDescription>
                    Here's our assessment of your answer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="strengths">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="strengths">Strengths</TabsTrigger>
                      <TabsTrigger value="improvements">Areas to Improve</TabsTrigger>
                      <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="strengths" className="space-y-4">
                      {currentFeedback.strengths.map((strength, index) => (
                        <div key={index} className="flex">
                          <ThumbsUp className="h-5 w-5 text-career-accent mr-3 mt-0.5 flex-shrink-0" />
                          <p>{strength}</p>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="improvements" className="space-y-4">
                      {currentFeedback.improvements.map((improvement, index) => (
                        <div key={index} className="flex">
                          <ThumbsDown className="h-5 w-5 text-career-warning mr-3 mt-0.5 flex-shrink-0" />
                          <p>{improvement}</p>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="suggestions" className="space-y-4">
                      {currentFeedback.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex">
                          <MessageSquare className="h-5 w-5 text-career-primary mr-3 mt-0.5 flex-shrink-0" />
                          <p>{suggestion}</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Score:</span>
                        <span className={`font-bold text-lg ${scoreColor(currentFeedback.score)}`}>
                          {currentFeedback.score}%
                        </span>
                      </div>
                      <div>
                        {currentFeedback.score >= 80 ? (
                          <div className="flex items-center text-career-accent">
                            <CheckCircle2 className="h-5 w-5 mr-1" />
                            <span className="font-medium">Great answer!</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-career-warning">
                            <AlertCircle className="h-5 w-5 mr-1" />
                            <span className="font-medium">Needs improvement</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No questions available. Please generate questions first.
              </p>
              <Button 
                onClick={() => navigate("/skill-questions")}
                className="bg-career-primary hover:bg-career-primary/90"
              >
                Generate Questions
              </Button>
            </CardContent>
          </Card>
        )}
        
        {answeredQuestions.length > 0 && (
          <div className="mt-8 flex justify-between">
            <Button 
              variant="outline" 
              className="text-career-danger border-career-danger hover:bg-career-danger/10"
              onClick={resetPractice}
            >
              Reset Practice Session
            </Button>
            
            <Button 
              className="bg-career-primary hover:bg-career-primary/90"
              onClick={() => navigate("/dashboard")}
            >
              <Save className="mr-2 h-4 w-4" /> Save and Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PracticeAnswers;
