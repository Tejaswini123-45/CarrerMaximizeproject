
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BriefcaseIcon, FileText, HelpCircle, MessageSquare, Building2, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userString = localStorage.getItem("careerMaxUser");
    setIsLoggedIn(!!userString);
  }, []);

  const features = [
    {
      icon: <FileText className="h-10 w-10 text-career-accent" />,
      title: "Resume Weakness Detector",
      description: "Identify and fix weaknesses in your resume to maximize your chances of getting interviews."
    },
    {
      icon: <HelpCircle className="h-10 w-10 text-career-accent" />,
      title: "Skill-Based Questions",
      description: "Get interview questions tailored to the skills and experience on your resume."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-career-accent" />,
      title: "Answer Practice",
      description: "Practice answering questions and get AI-powered feedback to improve your responses."
    },
    {
      icon: <Building2 className="h-10 w-10 text-career-accent" />,
      title: "Company Questions",
      description: "Prepare for interviews with questions specific to companies and roles you're targeting."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-career-primary" />
              <span className="ml-2 text-xl font-bold text-career-primary">Career Maximize</span>
            </div>
            <div>
              {isLoggedIn ? (
                <Button
                  className="bg-career-primary hover:bg-career-primary/90"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
              ) : (
                <div className="space-x-4">
                  <Button
                    variant="outline"
                    className="border-career-primary text-career-primary"
                    onClick={() => navigate("/login")}
                  >
                    Log In
                  </Button>
                  <Button
                    className="bg-career-primary hover:bg-career-primary/90"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-career-light to-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-career-primary mb-6 animate-fade-in">
              Ace Your Next Job Interview
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 animate-fade-in">
              The all-in-one toolkit to optimize your resume, practice interview questions, and get AI-powered feedback to land your dream job.
            </p>
            <Button
              className="bg-career-primary hover:bg-career-primary/90 h-12 px-8 text-lg animate-slide-up"
              onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started for Free"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-career-primary mb-4">Maximize Your Career Potential</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI-powered toolkit helps you prepare for every step of the job interview process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="rounded-full bg-career-primary/10 p-3 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-career-primary mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-career-primary py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Boost Your Interview Success?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Join thousands of job seekers who have improved their interview performance with our AI-powered tools.
          </p>
          <Button
            className="bg-white text-career-primary hover:bg-gray-100 h-12 px-8 text-lg"
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/signup")}
          >
            {isLoggedIn ? "Go to Dashboard" : "Get Started Today"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <BriefcaseIcon className="h-6 w-6 text-career-primary" />
              <span className="ml-2 text-lg font-bold text-career-primary">Career Maximize</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Career Maximize Toolkit. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
