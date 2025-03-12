
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Idea } from "@/lib/types";
import { loadIdeas } from "@/lib/store";
import IdeaCard from "@/components/IdeaCard";
import Navbar from "@/components/Navbar";

const Index = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const loadData = () => {
      const data = loadIdeas();
      setIdeas(data);
      setIsLoading(false);
    };
    
    loadData();
    
    // Set up event listener for storage changes
    window.addEventListener("storage", loadData);
    
    return () => {
      window.removeEventListener("storage", loadData);
    };
  }, []);
  
  // Filter ideas based on search query
  const filteredIdeas = ideas.filter(idea => 
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-20"
    >
      {/* Header */}
      <div className="glass sticky top-0 pt-6 pb-3 px-6 z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-semibold text-center mb-4">
            First Projects - Ideas Stack
          </h1>
          
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-secondary/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </motion.div>
      </div>
      
      {/* Main content */}
      <div className="px-6 py-6 max-w-md mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary rounded-full mb-4"></div>
              <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-secondary rounded w-1/2"></div>
            </div>
          </div>
        ) : filteredIdeas.length > 0 ? (
          <div className="space-y-2">
            {filteredIdeas.map((idea, index) => (
              <IdeaCard key={idea.id} idea={idea} index={index} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20"
          >
            <div className="bg-secondary/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">No ideas yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your first project idea to get started
            </p>
            <Link
              to="/add"
              className="inline-flex items-center justify-center bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Create Idea
            </Link>
          </motion.div>
        )}
      </div>
      
      {/* Floating action button */}
      {ideas.length > 0 && (
        <Link
          to="/add"
          className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
          aria-label="Add new idea"
        >
          <Plus className="h-6 w-6" />
        </Link>
      )}
      
      <Navbar />
    </motion.div>
  );
};

export default Index;
