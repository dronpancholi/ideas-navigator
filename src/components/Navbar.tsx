
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, CheckSquare, Settings } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Track scroll position for styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 p-3 transition-all duration-300 ${
      isScrolled ? "glass shadow-lg" : "bg-transparent"
    }`}>
      <div className="max-w-md mx-auto flex items-center justify-around">
        <NavItem 
          to="/" 
          icon={<Home className="w-5 h-5" />} 
          label="Home" 
          isActive={location.pathname === "/"} 
        />
        <NavItem 
          to="/tasks" 
          icon={<CheckSquare className="w-5 h-5" />} 
          label="Tasks" 
          isActive={location.pathname === "/tasks"} 
        />
        <NavItem 
          to="/settings" 
          icon={<Settings className="w-5 h-5" />} 
          label="Settings" 
          isActive={location.pathname === "/settings"} 
        />
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
      isActive
        ? "text-primary bg-primary/10"
        : "text-foreground/60 hover:text-primary hover:bg-primary/5"
    }`}
    aria-label={label}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </Link>
);

export default Navbar;
