import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Loader2 } from "lucide-react";
import { ResumeData } from "@/utils/types/resumeTypes";

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
  // Function to get a preview of the content
  const getContentPreview = (content: string, maxLength = 500) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Resume</CardTitle>
        <CardDescription>
          Uploaded on {new Date(resumeData.uploadDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <div className="bg-career-primary/10 p-3 rounded-full flex-shrink-0 mt-1">
            <FileText className="h-6 w-6 text-career-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{resumeData.fileName}</p>
            <div className="mt-2 text-sm text-muted-foreground bg-slate-50 p-3 rounded-md max-h-60 overflow-y-auto">
              {getContentPreview(resumeData.content)}
            </div>
          </div>
        </div>
        
        {showAnalyzeButton && (
          <Button
            className="mt-4 bg-career-primary hover:bg-career-primary/90 w-full sm:w-auto"
            onClick={onAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Resume...
              </span>
            ) : (
              <>Analyze This Resume</>
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
