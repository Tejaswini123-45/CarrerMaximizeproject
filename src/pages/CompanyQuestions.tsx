
import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Building2, Search, Briefcase, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CompanyQuestion {
  id: string;
  question: string;
  type: string;
}

const companies = [
  { id: "google", name: "Google", logo: "G" },
  { id: "amazon", name: "Amazon", logo: "A" },
  { id: "microsoft", name: "Microsoft", logo: "M" },
  { id: "apple", name: "Apple", logo: "A" },
  { id: "meta", name: "Meta", logo: "M" },
  { id: "netflix", name: "Netflix", logo: "N" }
];

const roles = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "Project Manager",
  "Marketing Specialist"
];

// Sample data for company-specific questions
const companyQuestionsData: Record<string, Record<string, CompanyQuestion[]>> = {
  google: {
    "Software Engineer": [
      { id: "g1", question: "Describe a time when you had to optimize code for performance. What was your approach?", type: "Technical" },
      { id: "g2", question: "How would you design a distributed system for real-time analytics?", type: "System Design" },
      { id: "g3", question: "Explain a situation where you had to make a technical decision that involved tradeoffs.", type: "Behavioral" }
    ],
    "Product Manager": [
      { id: "g4", question: "How would you determine if a product feature was successful?", type: "Product Sense" },
      { id: "g5", question: "Describe a situation where you had to make a product decision with incomplete data.", type: "Behavioral" },
      { id: "g6", question: "How would you prioritize features for Google Maps?", type: "Product Strategy" }
    ]
  },
  amazon: {
    "Software Engineer": [
      { id: "a1", question: "Describe how you would implement a scalable service for Amazon's checkout system.", type: "System Design" },
      { id: "a2", question: "Tell me about a time when you faced a difficult technical problem and how you solved it.", type: "Behavioral" },
      { id: "a3", question: "How would you design a recommendation algorithm for Amazon products?", type: "Technical" }
    ],
    "Data Scientist": [
      { id: "a4", question: "How would you measure the impact of a new Amazon Prime feature?", type: "Analytics" },
      { id: "a5", question: "Describe a time when your data analysis led to a significant business decision.", type: "Behavioral" },
      { id: "a6", question: "How would you design an experiment to test pricing strategies?", type: "Experimental Design" }
    ]
  },
  microsoft: {
    "Software Engineer": [
      { id: "m1", question: "How would you design a system like Microsoft Teams to handle millions of concurrent users?", type: "System Design" },
      { id: "m2", question: "Describe a time when you had to refactor a large codebase. What was your approach?", type: "Behavioral" },
      { id: "m3", question: "How would you implement a feature to automatically organize files in OneDrive?", type: "Technical" }
    ]
  }
};

const CompanyQuestions = () => {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState<CompanyQuestion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const handleSearch = () => {
    if (!selectedCompany || !selectedRole) {
      toast.error("Please select both a company and role");
      return;
    }
    
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    
    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // Check if we have predefined questions for this combination
      if (companyQuestionsData[selectedCompany]?.[selectedRole]) {
        setQuestions(companyQuestionsData[selectedCompany][selectedRole]);
      } else {
        // Generate generic questions for combinations we don't have predefined
        const genericQuestions: CompanyQuestion[] = [
          { id: "gen1", question: `What interests you about working at ${companies.find(c => c.id === selectedCompany)?.name}?`, type: "Behavioral" },
          { id: "gen2", question: `Describe a project relevant to the ${selectedRole} role that you're proud of.`, type: "Experience" },
          { id: "gen3", question: `How do you stay updated with the latest trends in ${selectedRole.toLowerCase()}?`, type: "Industry Knowledge" },
          { id: "gen4", question: "Describe a situation where you had to learn a new technology or skill quickly.", type: "Adaptability" },
          { id: "gen5", question: "Tell me about a time when you had to work under pressure to meet a deadline.", type: "Behavioral" }
        ];
        setQuestions(genericQuestions);
      }
      
      setIsGenerating(false);
    }, 2000);
  };
  
  const copyQuestion = (id: string, question: string) => {
    navigator.clipboard.writeText(question);
    setCopiedId(id);
    toast.success("Question copied to clipboard");
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };
  
  const filteredQuestions = searchQuery
    ? questions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : questions;
  
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-career-primary mb-6">Company-Specific Interview Questions</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Company Questions</CardTitle>
            <CardDescription>
              Get interview questions tailored to specific companies and roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger id="company">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.id}>
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-career-primary text-white flex items-center justify-center mr-2">
                              {company.logo}
                            </div>
                            {company.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2" />
                            {role}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-col justify-end space-y-4">
                <Button 
                  className="bg-career-primary hover:bg-career-primary/90 w-full"
                  onClick={handleSearch}
                  disabled={isGenerating || !selectedCompany || !selectedRole}
                >
                  {isGenerating ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Questions...
                    </span>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" /> Find Questions
                    </>
                  )}
                </Button>
                
                {isGenerating && (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-center text-muted-foreground">
                      Analyzing company interview patterns...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {questions.length > 0 && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-career-primary" />
                  {companies.find(c => c.id === selectedCompany)?.name} - {selectedRole}
                </h2>
                <p className="text-muted-foreground">{questions.length} interview questions found</p>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search questions..."
                  className="pl-9 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Questions</TabsTrigger>
                {Array.from(new Set(questions.map(q => q.type))).map(type => (
                  <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="space-y-4 mt-4">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No questions match your search</p>
                  </div>
                ) : (
                  filteredQuestions.map(question => (
                    <Card key={question.id} className="question-card">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="inline-block px-2 py-1 bg-career-primary/10 text-career-primary text-xs font-medium rounded mb-2">
                              {question.type}
                            </span>
                            <p>{question.question}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyQuestion(question.id, question.question)}
                            className="text-gray-500 hover:text-career-primary"
                          >
                            {copiedId === question.id ? (
                              <Check className="h-4 w-4 text-career-accent" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              {Array.from(new Set(questions.map(q => q.type))).map(type => (
                <TabsContent key={type} value={type} className="space-y-4 mt-4">
                  {questions
                    .filter(q => q.type === type)
                    .filter(q => !searchQuery || q.question.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(question => (
                      <Card key={question.id} className="question-card">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <p>{question.question}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyQuestion(question.id, question.question)}
                              className="text-gray-500 hover:text-career-primary"
                            >
                              {copiedId === question.id ? (
                                <Check className="h-4 w-4 text-career-accent" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyQuestions;
