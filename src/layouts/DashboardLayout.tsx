
import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  BriefcaseIcon,
  MessageSquare,
  Building2,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("careerMaxUser");
    localStorage.removeItem("userResume");
    navigate("/login");
  };

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard"
    },
    {
      title: "Resume Analyzer",
      icon: <FileText size={20} />,
      path: "/resume-analyzer"
    },
    {
      title: "Skill Questions",
      icon: <HelpCircle size={20} />,
      path: "/skill-questions"
    },
    {
      title: "Practice Answers",
      icon: <MessageSquare size={20} />,
      path: "/practice-answers"
    },
    {
      title: "Company Questions",
      icon: <Building2 size={20} />,
      path: "/company-questions"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-career-primary text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BriefcaseIcon className="h-6 w-6" />
          <span className="font-bold">Career Maximize</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white hover:bg-career-primary/90"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 md:h-screen overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <BriefcaseIcon className="h-6 w-6 text-career-primary" />
            <span className="font-bold text-xl text-career-primary">Career Maximize</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                className={`w-full justify-start mb-1 ${
                  window.location.pathname === item.path
                    ? "bg-career-primary/10 text-career-primary"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </Button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
