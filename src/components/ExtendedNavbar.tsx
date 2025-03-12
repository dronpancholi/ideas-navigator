
import { Home, ClipboardList, Settings, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const ExtendedNavbar = () => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => {
    if (route === "/" && path === "/") return true;
    if (route !== "/" && path.startsWith(route)) return true;
    return false;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-10 pb-safe"
    >
      <div className="p-4 mx-auto max-w-md">
        <div className="flex items-center justify-around bg-card/80 backdrop-blur-md shadow-lg rounded-2xl px-2 py-1 border">
          <Link
            to="/"
            className={`p-3 rounded-xl flex flex-col items-center ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link
            to="/tasks"
            className={`p-3 rounded-xl flex flex-col items-center ${
              isActive("/tasks") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <ClipboardList className="h-5 w-5" />
            <span className="text-xs mt-1">Tasks</span>
          </Link>
          
          <Link
            to="/chat"
            className={`p-3 rounded-xl flex flex-col items-center ${
              isActive("/chat") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs mt-1">Chat</span>
          </Link>
          
          <Link
            to="/settings"
            className={`p-3 rounded-xl flex flex-col items-center ${
              isActive("/settings") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ExtendedNavbar;
