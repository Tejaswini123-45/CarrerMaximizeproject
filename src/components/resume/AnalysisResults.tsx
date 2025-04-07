import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { AnalysisResult } from "@/utils/types/resumeTypes";

interface AnalysisResultsProps {
  analysisResult: AnalysisResult;
}

const AnalysisResults = ({ analysisResult }: AnalysisResultsProps) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default AnalysisResults;
