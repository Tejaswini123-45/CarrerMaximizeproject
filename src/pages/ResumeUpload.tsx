
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, Check, X } from "lucide-react";
import { toast } from "sonner";

const ResumeUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file) return;

    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF, Word document, or text file");
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setFile(file);

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!file || !fileContent) {
      toast.error("Please upload a resume file first");
      return;
    }

    setIsUploading(true);

    try {
      // In a real app, you would send the file to a server
      // For this demo, we'll just simulate the upload
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save file content to localStorage (in a real app, this would be stored in a database)
      const resumeData = {
        fileName: file.name,
        content: fileContent,
        uploadDate: new Date().toISOString()
      };
      
      localStorage.setItem("userResume", JSON.stringify(resumeData));
      toast.success("Resume uploaded successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to upload resume. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setFileContent(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-2xl font-bold text-career-primary mb-6">Upload Your Resume</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Resume Upload</CardTitle>
            <CardDescription>
              Upload your resume to analyze strengths, weaknesses, and generate relevant interview questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`resume-upload-area ${isDragging ? "active" : ""} ${file ? "border-career-accent" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              
              {file ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-career-accent/10 rounded-full flex items-center justify-center mb-4">
                    <File className="h-8 w-8 text-career-accent" />
                  </div>
                  <h3 className="text-lg font-medium">{file.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                  <div className="flex mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel();
                      }}
                    >
                      <X className="mr-1 h-4 w-4" /> Change
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium">Drag and drop your resume</h3>
                  <p className="text-sm text-gray-500 mt-1">Or click to browse files</p>
                  <p className="text-xs text-gray-400 mt-4">Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button 
              className="bg-career-primary hover:bg-career-primary/90"
              onClick={handleSubmit}
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Upload Resume
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResumeUpload;
