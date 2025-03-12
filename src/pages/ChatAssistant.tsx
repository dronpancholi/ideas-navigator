
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AiChatBox from "@/components/AiChatBox";
import ExtendedNavbar from "@/components/ExtendedNavbar";

const ChatAssistant = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-screen"
    >
      {/* Header */}
      <div className="glass sticky top-0 z-10 px-6 py-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="ml-2 text-xl font-medium">AI Chat Assistant</h1>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden px-1 pb-20">
        <div className="bg-background/80 backdrop-blur-sm rounded-xl h-full max-w-md mx-auto shadow-sm border">
          <AiChatBox />
        </div>
      </div>
      
      <ExtendedNavbar />
    </motion.div>
  );
};

export default ChatAssistant;
