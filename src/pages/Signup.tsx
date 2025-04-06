
import AuthForm from "@/components/auth/AuthForm";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-career-primary">Career Maximize Toolkit</h1>
        <p className="text-muted-foreground mt-2">Begin your career optimization journey</p>
      </div>
      <AuthForm isLogin={false} />
    </div>
  );
};

export default Signup;
