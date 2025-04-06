
import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("careerMaxUser");
    
    if (!userString) {
      navigate("/login");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;
