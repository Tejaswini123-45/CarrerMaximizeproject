
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Loader2 } from "lucide-react";
import { ResumeData } from "@/utils/resumeAnalysis";

interface ResumeDisplayProps {
  resumeData: ResumeData;
  isAnalyzing: boolean;
  progress: number;
  onAnalyze: () => void;
  showAnalyzeButton: boolean;
}

const ResumeDisplay = ({ 
  resumeData, 
  isAnalyzing, 
  progress, 
  onAnalyze, 
  showAnalyzeButton 
}: ResumeDisplayProps) => {
  return (
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
        
        {showAnalyzeButton && (
          <Button
            className="mt-4 bg-career-primary hover:bg-career-primary/90"
            onClick={onAnalyze}
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
  );
};

export default ResumeDisplay;
