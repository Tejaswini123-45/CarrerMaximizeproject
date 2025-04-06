
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, ThumbsUp, ThumbsDown, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle, Award } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
  category: string;
}

interface AnswerFeedback {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  score: number;
}

const PracticeAnswers = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, { answer: string; feedback: AnswerFeedback }>>({});
  const [averageScore, setAverageScore] = useState(0);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  
  useEffect(() => {
    // Get questions from localStorage
    const storedQuestions = localStorage.getItem("generatedQuestions");
    if (!storedQuestions) {
      toast.error("No questions found. Please generate questions first.");
      navigate("/skill-questions");
      return;
    }
    
    setQuestions(JSON.parse(storedQuestions));
    
    // Get previously answered questions
    const storedAnswers = localStorage.getItem("practiceAnswers");
    if (storedAnswers) {
      const parsedAnswers = JSON.parse(storedAnswers);
      setAnsweredQuestions(parsedAnswers);
      
      // Calculate average score
      const scores = Object.values(parsedAnswers).map((item: any) => item.feedback.score);
      if (scores.length > 0) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        setAverageScore(Math.round(avg));
        
        // Mark as completed if all questions answered
        const parsed = JSON.parse(storedQuestions);
        if (Object.keys(parsedAnswers).length === parsed.length) {
          setPracticeCompleted(true);
        }
      }
    }
  }, [navigate]);
  
  const currentQuestion = questions[currentIndex];
  
  const evaluateAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please enter your answer");
      return;
    }
    
    setIsEvaluating(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 20;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);
    
    try {
      // In a real app, you would make an API call to evaluate the answer
      // For this demo, we'll simulate with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Generate random feedback based on the question category
      let mockFeedback: AnswerFeedback;
      
      const randomScore = Math.floor(Math.random() * 41) + 60; // Random score between 60-100
      
      if (currentQuestion.category === "Technical") {
        mockFeedback = {
          strengths: [
            "Good technical explanation of concepts",
            "Clear logical structure to your answer"
          ],
          weaknesses: [
            "Could provide more specific examples",
            "Technical terminology could be more precise"
          ],
          suggestions: [
            "Include real-world examples of how you've applied these skills",
            "Elaborate on your problem-solving methodology",
            "Quantify the impact of your technical solutions when possible"
          ],
          score: randomScore
        };
      } else if (currentQuestion.category === "Behavioral") {
        mockFeedback = {
          strengths: [
            "Good use of the STAR method in your response",
            "Demonstrated self-awareness and learning from the situation"
          ],
          weaknesses: [
            "Could provide more details about your specific actions",
            "The outcome description could be more substantial"
          ],
          suggestions: [
            "Be more specific about your personal contributions",
            "Include what you learned from the experience",
            "Quantify the results where possible"
          ],
          score: randomScore
        };
      } else {
        mockFeedback = {
          strengths: [
            "Well-structured and coherent response",
            "Good balance of details and conciseness"
          ],
          weaknesses: [
            "Answer could be more tailored to showcase relevant skills",
            "Some statements would benefit from supporting examples"
          ],
          suggestions: [
            "Incorporate industry-specific terminology",
            "Connect your experience more directly to the job requirements",
            "Consider adding a brief summary statement at the end"
          ],
          score: randomScore
        };
      }
      
      setFeedback(mockFeedback);
      
      // Update answered questions
      const updatedAnswers = {
        ...answeredQuestions,
        [currentQuestion.id]: { answer, feedback: mockFeedback }
      };
      setAnsweredQuestions(updatedAnswers);
      
      // Calculate new average score
      const scores = Object.values(updatedAnswers).map(item => item.feedback.score);
      const newAverage = scores.reduce((a, b) => a + b, 0) / scores.length;
      setAverageScore(Math.round(newAverage));
      
      // Save to localStorage
      localStorage.setItem("practiceAnswers", JSON.stringify(updatedAnswers));
      localStorage.setItem("practiceScore", newAverage.toString());
      
      // Check if all questions have been answered
      if (Object.keys(updatedAnswers).length === questions.length) {
        setPracticeCompleted(true);
      }
    } catch (error) {
      toast.error("Failed to evaluate answer. Please try again.");
      console.error("Evaluation error:", error);
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsEvaluating(false);
    }
  };
  
  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
      setFeedback(null);
      
      // If the next question has already been answered, show the previous answer and feedback
      const nextQuestionId = questions[currentIndex + 1].id;
      if (answeredQuestions[nextQuestionId]) {
        setAnswer(answeredQuestions[nextQuestionId].answer);
        setFeedback(answeredQuestions[nextQuestionId].feedback);
      }
    } else {
      // All questions answered
      setPracticeCompleted(true);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setAnswer("");
      setFeedback(null);
      
      // If the previous question has already been answered, show the previous answer and feedback
      const prevQuestionId = questions[currentIndex - 1].id;
      if (answeredQuestions[prevQuestionId]) {
        setAnswer(answeredQuestions[prevQuestionId].answer);
        setFeedback(answeredQuestions[prevQuestionId].feedback);
      }
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-career-accent";
    if (score >= 70) return "text-career-warning";
    return "text-career-danger";
  };
  
  const getScoreBadge = (score: number) => {
    if (score >= 80) return "score-high";
    if (score >= 70) return "score-medium";
    return "score-low";
  };
  
  if (questions.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Questions Available</h2>
          <p className="text-muted-foreground mb-6">You need to generate questions before practicing answers.</p>
          <Button 
            className="bg-career-primary hover:bg-career-primary/90"
            onClick={() => navigate("/skill-questions")}
          >
            Go to Question Generator
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  if (practiceCompleted) {
    return (
      <DashboardLayout>
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-career-primary mb-6">Practice Completed!</h1>
          
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Your Performance Summary</CardTitle>
                <div className={`${getScoreBadge(averageScore)} px-3 py-1`}>
                  <span className="font-bold">{averageScore}%</span>
                </div>
              </div>
              <CardDescription>
                You have practiced answering {questions.length} interview questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-4 flex justify-center">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className={`h-20 w-20 ${getScoreColor(averageScore)}`} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center mt-16">
                    <span className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}%</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-career-primary/10 p-3 rounded-full mb-2">
                      <MessageSquare className="h-5 w-5 text-career-primary" />
                    </div>
                    <span className="text-2xl font-bold">{questions.length}</span>
                    <span className="text-sm text-muted-foreground">Questions Answered</span>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-career-accent/10 p-3 rounded-full mb-2">
                      <ThumbsUp className="h-5 w-5 text-career-accent" />
                    </div>
                    <span className="text-2xl font-bold">
                      {Object.values(answeredQuestions).filter(a => a.feedback.score >= 80).length}
                    </span>
                    <span className="text-sm text-muted-foreground">Strong Answers</span>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-career-warning/10 p-3 rounded-full mb-2">
                      <AlertTriangle className="h-5 w-5 text-career-warning" />
                    </div>
                    <span className="text-2xl font-bold">
                      {Object.values(answeredQuestions).filter(a => a.feedback.score < 80).length}
                    </span>
                    <span className="text-sm text-muted-foreground">Needs Improvement</span>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate("/company-questions")}
              >
                Try Company-Specific Questions
              </Button>
              <Button
                className="bg-career-primary hover:bg-career-primary/90"
                onClick={() => {
                  setCurrentIndex(0);
                  setPracticeCompleted(false);
                }}
              >
                Review Your Answers
              </Button>
            </CardFooter>
          </Card>
          
          <h2 className="text-xl font-semibold mb-4">Performance by Question Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["Technical", "Behavioral", "Experience", "Situational"].map(category => {
              const categoryQuestions = Object.entries(answeredQuestions).filter(
                ([id]) => questions.find(q => q.id === id)?.category === category
              );
              
              if (categoryQuestions.length === 0) return null;
              
              const categoryScores = categoryQuestions.map(([, data]) => data.feedback.score);
              const avgScore = categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length;
              
              return (
                <Card key={category}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{category} Questions</CardTitle>
                      <div className={`${getScoreBadge(avgScore)} px-2 py-0.5`}>
                        <span className="text-sm font-medium">{Math.round(avgScore)}%</span>
                      </div>
                    </div>
                    <CardDescription>
                      {categoryQuestions.length} questions in this category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Performance</span>
                        <span className={getScoreColor(avgScore)}>{Math.round(avgScore)}%</span>
                      </div>
                      <Progress 
                        value={avgScore} 
                        className="h-2" 
                        indicatorClassName={
                          avgScore >= 80 ? "bg-career-accent" : 
                          avgScore >= 70 ? "bg-career-warning" : 
                          "bg-career-danger"
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!currentQuestion) return null;
  
  const isAnswered = currentQuestion && answeredQuestions[currentQuestion.id];
  
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-career-primary">Answer Practice</h1>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousQuestion}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextQuestion}
                disabled={currentIndex === questions.length - 1 && !isAnswered}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-career-primary/10 text-career-primary text-xs font-medium rounded">
                {currentQuestion.category}
              </span>
              {isAnswered && (
                <span className={`px-2 py-1 ${getScoreBadge(answeredQuestions[currentQuestion.id].feedback.score)} text-xs font-medium rounded-full`}>
                  Score: {answeredQuestions[currentQuestion.id].feedback.score}%
                </span>
              )}
            </div>
            <CardTitle className="text-xl mt-2">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[150px]"
              disabled={isEvaluating || isAnswered}
            />
            
            {isEvaluating && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Evaluating your answer...</span>
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            {!feedback ? (
              <Button 
                className="bg-career-primary hover:bg-career-primary/90"
                onClick={evaluateAnswer}
                disabled={isEvaluating || !answer.trim() || isAnswered}
              >
                {isEvaluating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Evaluating...
                  </span>
                ) : (
                  <>Evaluate Answer</>
                )}
              </Button>
            ) : (
              <Button 
                className="bg-career-primary hover:bg-career-primary/90"
                onClick={goToNextQuestion}
                disabled={currentIndex === questions.length - 1 && Object.keys(answeredQuestions).length === questions.length}
              >
                {currentIndex === questions.length - 1 && Object.keys(answeredQuestions).length === questions.length ? (
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    View Results
                  </span>
                ) : (
                  <>Next Question</>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {feedback && (
          <div className="space-y-4 animate-slide-up">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Answer Evaluation</CardTitle>
                  <div className={`${getScoreBadge(feedback.score)} px-3 py-1`}>
                    <span className="font-bold">{feedback.score}%</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-md font-medium flex items-center mb-2">
                    <ThumbsUp className="h-4 w-4 text-career-accent mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-career-accent mr-2 mt-0.5" />
                        <span className="feedback-positive">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-md font-medium flex items-center mb-2">
                    <ThumbsDown className="h-4 w-4 text-career-danger mr-2" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {feedback.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-career-danger mr-2 mt-0.5" />
                        <span className="feedback-negative">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Suggestions for Improvement</h3>
                  <ul className="space-y-2">
                    {feedback.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-career-primary text-white rounded-full w-4 h-4 flex items-center justify-center mr-2 mt-0.5">
                          <span className="text-xs">{index + 1}</span>
                        </div>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PracticeAnswers;
