
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BriefcaseIcon } from "lucide-react";

interface AuthFormProps {
  isLogin: boolean;
}

const AuthForm = ({ isLogin }: AuthFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!email || !password) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (!isLogin && password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful authentication
      localStorage.setItem("careerMaxUser", JSON.stringify({ email }));
      toast.success(isLogin ? "Logged in successfully!" : "Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Authentication failed. Please try again.");
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-career-primary flex items-center justify-center">
            <BriefcaseIcon className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center font-bold">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin
            ? "Enter your credentials to access your account"
            : "Sign up to get started with Career Maximize Toolkit"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full bg-career-primary hover:bg-career-primary/90" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? "Logging in..." : "Creating account..."}
              </span>
            ) : (
              <>{isLogin ? "Login" : "Create Account"}</>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="link" 
          onClick={() => navigate(isLogin ? "/signup" : "/login")}
          className="text-career-secondary"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
